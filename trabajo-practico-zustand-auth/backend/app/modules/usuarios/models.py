from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.pedidos.models import Pedido


class UsuarioRol(SQLModel, table=True):
    __tablename__ = "usuario_rol"

    usuario_id: int = Field(foreign_key="usuarios.id", primary_key=True)
    rol_id: int = Field(foreign_key="roles.id", primary_key=True)
    asignado_por_id: Optional[int] = Field(default=None, foreign_key="usuarios.id")
    expires_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)


class Rol(SQLModel, table=True):
    __tablename__ = "roles"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True, nullable=False)
    descripcion: Optional[str] = Field(default=None)

    usuarios: List["Usuario"] = Relationship(
        back_populates="roles",
        link_model=UsuarioRol,
        sa_relationship_kwargs={
            "primaryjoin": "Rol.id==UsuarioRol.rol_id",
            "secondaryjoin": "Usuario.id==UsuarioRol.usuario_id",
        },
    )


class Usuario(SQLModel, table=True):
    __tablename__ = "usuarios"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(nullable=False)
    apellido: str = Field(nullable=False)
    email: str = Field(unique=True, index=True, nullable=False)
    celular: Optional[str] = Field(default=None)
    password_hash: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    deleted_at: Optional[datetime] = Field(default=None)

    roles: List[Rol] = Relationship(
        back_populates="usuarios",
        link_model=UsuarioRol,
        sa_relationship_kwargs={
            "primaryjoin": "Usuario.id==UsuarioRol.usuario_id",
            "secondaryjoin": "Rol.id==UsuarioRol.rol_id",
        },
    )
    pedidos: List["Pedido"] = Relationship(back_populates="usuario")
