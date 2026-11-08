from typing import List
from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.config import settings
from app.core.database import SessionDep
from app.core.deps import get_current_active_user, require_role
from app.modules.usuarios.models import Rol, Usuario
from app.modules.usuarios.schemas import MessageResponse, RolRead, UserCreate, UserPublic
from app.modules.usuarios.service import UsuarioService

auth_router = APIRouter(prefix="/auth", tags=["Autenticación"])
admin_router = APIRouter(prefix="/admin/usuarios", tags=["Usuarios (Admin)"])
roles_router = APIRouter(prefix="/roles", tags=["Roles"])


@auth_router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, session: SessionDep) -> UserPublic:
    service = UsuarioService(session)
    return service.register(data)


@auth_router.post("/token", response_model=MessageResponse)
@auth_router.post("/login", response_model=MessageResponse)
def login(
    response: Response,
    session: SessionDep,
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> MessageResponse:
    service = UsuarioService(session)
    token, _ = service.authenticate(form_data.username, form_data.password)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=False,
        path="/",
    )
    return MessageResponse(message="Login exitoso")


@auth_router.post("/logout", response_model=MessageResponse)
def logout(response: Response) -> MessageResponse:
    response.delete_cookie(key="access_token", path="/")
    return MessageResponse(message="Sesión cerrada exitosamente")


@auth_router.get("/me", response_model=UserPublic)
def read_current_user(
    session: SessionDep,
    current_user: Usuario = Depends(get_current_active_user),
) -> UserPublic:
    service = UsuarioService(session)
    return service.get_public_profile(current_user)


@admin_router.get("", response_model=List[UserPublic])
@admin_router.get("/", response_model=List[UserPublic])
def listar_usuarios(
    session: SessionDep,
    _: Usuario = Depends(require_role(["admin"])),
) -> List[UserPublic]:
    service = UsuarioService(session)
    return service.list_all()


@admin_router.post("/{id}/activar", response_model=UserPublic)
def activar_usuario(
    id: int,
    session: SessionDep,
    _: Usuario = Depends(require_role(["admin"])),
) -> UserPublic:
    service = UsuarioService(session)
    return service.activar(id)


@admin_router.post("/{id}/desactivar", response_model=UserPublic)
def desactivar_usuario(
    id: int,
    session: SessionDep,
    current_admin: Usuario = Depends(require_role(["admin"])),
) -> UserPublic:
    service = UsuarioService(session)
    return service.desactivar(id, current_admin.id)


@roles_router.get("", response_model=List[RolRead])
@roles_router.get("/", response_model=List[RolRead])
def listar_roles(
    session: SessionDep,
    _: Usuario = Depends(get_current_active_user),
) -> List[RolRead]:
    from sqlmodel import select
    roles = session.exec(select(Rol).order_by(Rol.id)).all()
    return [RolRead(id=r.id, nombre=r.nombre, descripcion=r.descripcion) for r in roles]

