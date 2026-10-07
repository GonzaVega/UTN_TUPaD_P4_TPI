from typing import TYPE_CHECKING, List, Optional
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.producto.model import Producto


class ProductoCategoria(SQLModel, table=True):
    """Tabla intermedia para modelar la relación Muchos a Muchos (N:N)
    entre Producto y Categoria con clave primaria compuesta.
    """
    __tablename__ = "producto_categoria"

    producto_id: Optional[int] = Field(
        default=None,
        foreign_key="productos.id",
        primary_key=True
    )
    categoria_id: Optional[int] = Field(
        default=None,
        foreign_key="categorias.id",
        primary_key=True
    )


class Categoria(SQLModel, table=True):
    """Entidad persistente de Categoría."""
    __tablename__ = "categorias"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, nullable=False)
    descripcion: Optional[str] = Field(default=None)

    # Relación N:N con Producto mediante la tabla intermedia
    productos: List["Producto"] = Relationship(
        back_populates="categorias",
        link_model=ProductoCategoria
    )
