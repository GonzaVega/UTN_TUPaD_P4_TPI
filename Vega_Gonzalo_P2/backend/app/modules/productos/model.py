from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.unidades_medida.model import UnidadMedida
    from app.modules.categorias.model import Categoria


class ProductoCategoria(SQLModel, table=True):
    __tablename__ = "producto_categoria"

    producto_id: int = Field(foreign_key="productos.id", primary_key=True)
    categoria_id: int = Field(foreign_key="categorias.id", primary_key=True)
    es_principal: bool = Field(default=False, nullable=False)


class Producto(SQLModel, table=True):
    __tablename__ = "productos"

    id: Optional[int] = Field(default=None, primary_key=True)
    unidad_venta_id: int = Field(foreign_key="unidades_medida.id", nullable=False)
    nombre: str = Field(index=True, nullable=False)
    descripcion: Optional[str] = Field(default=None, nullable=True)
    precio_base: float = Field(default=0.0, ge=0.0, nullable=False)
    stock_cantidad: float = Field(default=0.0, ge=0.0, nullable=False)
    disponible: bool = Field(default=True, nullable=False)
    activo: bool = Field(default=True, nullable=False)
    anulado_at: Optional[datetime] = Field(default=None, nullable=True)

    unidad_venta: "UnidadMedida" = Relationship(
        back_populates="productos"
    )
    categorias: List["Categoria"] = Relationship(
        back_populates="productos",
        link_model=ProductoCategoria
    )
