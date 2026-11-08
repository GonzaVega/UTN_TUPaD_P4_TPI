from typing import Callable, List, Optional
from fastapi import Depends, HTTPException, Request, status
from sqlmodel import Session, select
from app.core.database import get_session
from app.core.security import JWTError, decode_access_token
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.repository import UsuarioRepository


def get_current_user(
    request: Request,
    session: Session = Depends(get_session),
) -> Usuario:
    token: Optional[str] = request.cookies.get("access_token")

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
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido: falta sujeto",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
        )

    user = session.exec(select(Usuario).where(Usuario.email == email)).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
        )
    return user


def get_current_active_user(
    current_user: Usuario = Depends(get_current_user),
) -> Usuario:
    if current_user.deleted_at is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cuenta de usuario desactivada",
        )
    return current_user


def require_role(allowed_roles: List[str]) -> Callable:
    def role_checker(
        current_user: Usuario = Depends(get_current_active_user),
        session: Session = Depends(get_session),
    ) -> Usuario:
        repo = UsuarioRepository(session)
        roles_vigentes = repo.get_roles_vigentes(current_user.id)
        tiene_permiso = any(r in allowed_roles for r in roles_vigentes)
        if not tiene_permiso:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tiene los permisos requeridos para esta acción",
            )
        return current_user

    return role_checker

