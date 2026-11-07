from datetime import datetime
from typing import Annotated, List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator
from app.modules.unidades_medida.model import UnidadMedidaPublic


class ProductoBase(BaseModel):
    nombre: Annotated[str, Field(min_length=3, description="Nombre obligatorio del producto (mín. 3 caracteres)")]
    descripcion: Optional[str] = Field(default=None, description="Descripción opcional")
    precio_base: Annotated[float, Field(ge=0.0, description="Precio base numérico mayor o igual a 0")]
    unidad_venta_id: Annotated[int, Field(gt=0, description="FK hacia la unidad de venta")]
    stock_cantidad: Annotated[float, Field(default=0.0, ge=0.0, description="Stock numérico mayor o igual a 0")]
    disponible: bool = Field(default=True, description="Pausa manual de venta, independiente de activo")

    @field_validator("nombre")
    @classmethod
    def validar_nombre_no_vacio(cls, value: str) -> str:
        limpio = value.strip()
        if len(limpio) < 3:
            raise ValueError("El nombre del producto debe tener al menos 3 caracteres.")
        return limpio


class ProductoCreate(ProductoBase):
    pass


class ProductoUpdate(ProductoBase):
    pass


class CategoriaEnProductoPublic(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    activo: bool
    es_principal: bool

    model_config = ConfigDict(from_attributes=True)


class ClasificarProductoRequest(BaseModel):
    categoria_id: Annotated[int, Field(gt=0, description="ID de la categoría a asociar")]
    es_principal: bool = Field(default=False, description="Indica si esta categoría pasa a ser la principal del producto")


class ProductoPublic(BaseModel):
    id: int
    unidad_venta_id: int
    nombre: str
    descripcion: Optional[str] = None
    precio_base: float
    stock_cantidad: float
    disponible: bool
    activo: bool
    anulado_at: Optional[datetime] = None
    hay_stock: bool
    unidad_venta: UnidadMedidaPublic
    categorias: List[CategoriaEnProductoPublic] = []

    model_config = ConfigDict(from_attributes=True)
