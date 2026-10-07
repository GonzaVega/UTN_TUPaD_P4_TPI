from typing import TYPE_CHECKING, List, Optional
from sqlmodel import Field, Relationship, SQLModel
from app.categoria.model import ProductoCategoria

if TYPE_CHECKING:
    from app.categoria.model import Categoria


class Producto(SQLModel, table=True):
    """Entidad persistente de Producto."""
    __tablename__ = "productos"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, nullable=False)
    descripcion: Optional[str] = Field(default=None)
    precio_base: float = Field(default=0.0, ge=0.0, nullable=False)
    imagen_url: Optional[str] = Field(default=None)
    disponible: bool = Field(default=True, nullable=False)

    # Relación N:N con Categoria mediante la tabla intermedia
    categorias: List["Categoria"] = Relationship(
        back_populates="productos",
        link_model=ProductoCategoria
    )
