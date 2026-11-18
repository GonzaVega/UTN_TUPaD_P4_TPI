from datetime import datetime, timezone
from typing import List, Optional
from sqlmodel import Session, select
from app.modules.usuarios.models import Rol, Usuario, UsuarioRol


class UsuarioRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, user_id: int) -> Optional[Usuario]:
        return self.session.get(Usuario, user_id)

    def get_by_email(self, email: str) -> Optional[Usuario]:
        return self.session.exec(select(Usuario).where(Usuario.email == email)).first()

    def get_all(self) -> List[Usuario]:
        return list(self.session.exec(select(Usuario).order_by(Usuario.id)).all())

    def create(self, usuario: Usuario) -> Usuario:
        self.session.add(usuario)
        self.session.flush()
        return usuario

    def get_roles_vigentes(self, usuario_id: int) -> List[str]:
        now = datetime.now(timezone.utc)
        statement = (
            select(Rol.nombre)
            .join(UsuarioRol, UsuarioRol.rol_id == Rol.id)
            .where(
                UsuarioRol.usuario_id == usuario_id,
                (UsuarioRol.expires_at.is_(None)) | (UsuarioRol.expires_at > now),
            )
        )
        return list(self.session.exec(statement).all())

    def get_rol_by_nombre(self, nombre: str) -> Optional[Rol]:
        return self.session.exec(select(Rol).where(Rol.nombre == nombre)).first()

    def assign_role(self, usuario_id: int, rol_id: int, asignado_por_id: Optional[int] = None) -> UsuarioRol:
        enlace = UsuarioRol(
            usuario_id=usuario_id,
            rol_id=rol_id,
            asignado_por_id=asignado_por_id,
        )
        self.session.add(enlace)
        self.session.flush()
        return enlace

