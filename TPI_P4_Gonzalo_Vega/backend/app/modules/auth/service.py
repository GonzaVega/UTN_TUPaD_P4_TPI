from typing import Tuple
from fastapi import HTTPException, status
from app.core.security import create_access_token, get_password_hash, verify_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.service import UsuarioDuplicado
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class AuthService:
    def __init__(self, uow: UsuarioUnitOfWork):
        self.uow = uow

    def register(self, data: UserCreate) -> UserPublic:
        with self.uow as uow:
            if uow.usuarios.get_by_username(data.username):
                raise UsuarioDuplicado(f"El nombre de usuario '{data.username}' ya está registrado")
            if uow.usuarios.get_by_email(str(data.email)):
                raise UsuarioDuplicado(f"El correo electrónico '{data.email}' ya está registrado")

            nuevo_usuario = Usuario(
                username=data.username,
                full_name=data.full_name,
                email=str(data.email),
                hashed_password=get_password_hash(data.password),
                role="user",
                disabled=False,
            )
            uow.usuarios.add(nuevo_usuario)
            return UserPublic.model_validate(nuevo_usuario)

    def authenticate(self, username: str, password: str) -> Tuple[str, UserPublic]:
        with self.uow as uow:
            user = uow.usuarios.get_by_username(username)
            if not user or not verify_password(password, user.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Credenciales incorrectas",
                )
            if user.disabled:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cuenta de usuario desactivada",
                )

            token_data = {
                "sub": user.username,
                "role": user.role,
                "id": user.id,
            }
            token = create_access_token(token_data)
            return token, UserPublic.model_validate(user)

