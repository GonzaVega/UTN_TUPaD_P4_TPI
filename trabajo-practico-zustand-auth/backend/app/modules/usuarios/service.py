from datetime import datetime, timezone
from typing import List, Tuple
from fastapi import HTTPException, status
from sqlmodel import Session
from app.core.security import create_access_token, get_password_hash, verify_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.repository import UsuarioRepository
from app.modules.usuarios.schemas import UserCreate, UserPublic


class UsuarioService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = UsuarioRepository(session)

    def register(self, data: UserCreate) -> UserPublic:
        existente = self.repo.get_by_email(data.email)
        if existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe un usuario registrado con el email '{data.email}'.",
            )

        rol_user = self.repo.get_rol_by_nombre("user")
        if not rol_user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="El rol 'user' no está configurado en el sistema.",
            )

        nuevo_usuario = Usuario(
            nombre=data.nombre.strip(),
            apellido=data.apellido.strip(),
            email=data.email.strip().lower(),
            celular=data.celular.strip() if data.celular else None,
            password_hash=get_password_hash(data.password),
        )
        self.repo.create(nuevo_usuario)
        self.repo.assign_role(nuevo_usuario.id, rol_user.id)
        self.session.commit()
        self.session.refresh(nuevo_usuario)

        roles_vigentes = self.repo.get_roles_vigentes(nuevo_usuario.id)
        return UserPublic(
            id=nuevo_usuario.id,
            nombre=nuevo_usuario.nombre,
            apellido=nuevo_usuario.apellido,
            email=nuevo_usuario.email,
            celular=nuevo_usuario.celular,
            roles=roles_vigentes,
            created_at=nuevo_usuario.created_at,
            deleted_at=nuevo_usuario.deleted_at,
        )

    def authenticate(self, email: str, password: str) -> Tuple[str, UserPublic]:
        user = self.repo.get_by_email(email.strip().lower())
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas",
            )

        if user.deleted_at is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cuenta de usuario desactivada",
            )

        roles_vigentes = self.repo.get_roles_vigentes(user.id)
        token = create_access_token(
            data={"sub": user.email, "roles": roles_vigentes, "id": user.id}
        )

        user_public = UserPublic(
            id=user.id,
            nombre=user.nombre,
            apellido=user.apellido,
            email=user.email,
            celular=user.celular,
            roles=roles_vigentes,
            created_at=user.created_at,
            deleted_at=user.deleted_at,
        )
        return token, user_public

    def get_public_profile(self, user: Usuario) -> UserPublic:
        roles_vigentes = self.repo.get_roles_vigentes(user.id)
        return UserPublic(
            id=user.id,
            nombre=user.nombre,
            apellido=user.apellido,
            email=user.email,
            celular=user.celular,
            roles=roles_vigentes,
            created_at=user.created_at,
            deleted_at=user.deleted_at,
        )

    def list_all(self) -> List[UserPublic]:
        usuarios = self.repo.get_all()
        resultado = []
        for u in usuarios:
            roles = self.repo.get_roles_vigentes(u.id)
            resultado.append(
                UserPublic(
                    id=u.id,
                    nombre=u.nombre,
                    apellido=u.apellido,
                    email=u.email,
                    celular=u.celular,
                    roles=roles,
                    created_at=u.created_at,
                    deleted_at=u.deleted_at,
                )
            )
        return resultado

    def activar(self, user_id: int) -> UserPublic:
        user = self.repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Usuario con id {user_id} no encontrado.",
            )
        user.deleted_at = None
        user.updated_at = datetime.now(timezone.utc)
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return self.get_public_profile(user)

    def desactivar(self, user_id: int, admin_id: int) -> UserPublic:
        if user_id == admin_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un administrador no puede desactivar su propia cuenta.",
            )
        user = self.repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Usuario con id {user_id} no encontrado.",
            )
        user.deleted_at = datetime.now(timezone.utc)
        user.updated_at = datetime.now(timezone.utc)
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return self.get_public_profile(user)

