from enum import Enum
from typing import TYPE_CHECKING, List, Optional
from pydantic import BaseModel, ConfigDict
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.productos.model import Producto


class TipoUnidad(str, Enum):
    peso = "peso"
    volumen = "volumen"
    contable = "contable"


class UnidadMedida(SQLModel, table=True):
    __tablename__ = "unidades_medida"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True, nullable=False)
    simbolo: str = Field(unique=True, nullable=False)
    tipo: TipoUnidad = Field(nullable=False)

    productos: List["Producto"] = Relationship(
        back_populates="unidad_venta"
    )


class UnidadMedidaPublic(BaseModel):
    id: int
    nombre: str
    simbolo: str
    tipo: TipoUnidad

    model_config = ConfigDict(from_attributes=True)

