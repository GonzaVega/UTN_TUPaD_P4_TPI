from typing import Callable, List, Optional
from fastapi import Depends, HTTPException, Request, status
from sqlmodel import Session, select
from app.core.database import session_factory
from app.core.security import JWTError, decode_access_token


def get_current_user(request: Request) -> "app.modules.usuarios.models.Usuario":  # type: ignore # noqa: F821
    """Extrae y valida el JWT de la cookie access_token (o del header Authorization)."""
    from app.modules.usuarios.models import Usuario

    token: Optional[str] = request.cookies.get("access_token")

    # Fallback opcional para herramientas como Swagger /docs
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[len("Bearer ") :]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Falta la cookie de sesión o el token no fue provisto",
        )

    try:
        payload = decode_access_token(token)
        username: Optional[str] = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido: falta sujeto",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
        )

    with session_factory() as session:
        statement = select(Usuario).where(Usuario.username == username)
        user = session.exec(statement).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no encontrado",
            )
        return user


def get_current_active_user(
    current_user: "app.modules.usuarios.models.Usuario" = Depends(get_current_user),  # type: ignore # noqa: F821
) -> "app.modules.usuarios.models.Usuario":  # type: ignore # noqa: F821
    """Verifica que el usuario autenticado no se encuentre desactivado."""
    if current_user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cuenta de usuario desactivada",
        )
    return current_user


def require_role(allowed_roles: List[str]) -> Callable:
    """Fábrica de dependencias que valida si el rol del usuario activo está autorizado."""

    def role_checker(
        current_user: "app.modules.usuarios.models.Usuario" = Depends(get_current_active_user),  # type: ignore # noqa: F821
    ) -> "app.modules.usuarios.models.Usuario":  # type: ignore # noqa: F821
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tiene los permisos requeridos para esta acción",
            )
        return current_user

    return role_checker

