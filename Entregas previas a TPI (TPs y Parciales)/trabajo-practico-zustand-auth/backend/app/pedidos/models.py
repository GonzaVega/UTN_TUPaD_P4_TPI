from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.usuarios.models import Usuario
    from app.producto.model import Producto


class DetallePedido(SQLModel, table=True):
    __tablename__ = "detalles_pedido"

    pedido_id: Optional[int] = Field(
        default=None,
        foreign_key="pedidos.id",
        primary_key=True,
    )
    producto_id: Optional[int] = Field(
        default=None,
        foreign_key="productos.id",
        primary_key=True,
    )
    cantidad: int = Field(ge=1, description="Cantidad mayor o igual a 1")
    precio_unitario: float = Field(
        ge=0.0,
        description="Snapshot del precio_base del producto al momento de crear el pedido",
    )

    pedido: Optional["Pedido"] = Relationship(back_populates="detalles")
    producto: Optional["Producto"] = Relationship()


class Pedido(SQLModel, table=True):
    __tablename__ = "pedidos"

    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: Optional[int] = Field(default=None, foreign_key="usuarios.id")
    fecha: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Fecha y hora de creación asignada por el backend",
    )
    estado: str = Field(
        default="PENDIENTE",
        description="Estado del pedido: PENDIENTE, CONFIRMADO, ENTREGADO o CANCELADO",
    )
    total: float = Field(
        default=0.0,
        ge=0.0,
        description="Total monetario acumulado de los detalles",
    )
    deleted_at: Optional[datetime] = Field(
        default=None,
        description="Fecha y hora de borrado lógico (soft delete)",
    )

    detalles: List[DetallePedido] = Relationship(
        back_populates="pedido",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    usuario: Optional["Usuario"] = Relationship(back_populates="pedidos")
