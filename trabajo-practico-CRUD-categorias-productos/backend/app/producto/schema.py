from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator
from app.categoria.schema import CategoriaRead


class ProductoBase(BaseModel):
    nombre: str = Field(..., min_length=1, description="Nombre del producto")
    descripcion: Optional[str] = Field(default=None, description="Descripción opcional")
    precio_base: float = Field(default=0.0, ge=0.0, description="Precio base mayor o igual a 0")
    imagen_url: Optional[str] = Field(default=None, description="URL de la imagen del producto")
    disponible: bool = Field(default=True, description="Indica si el producto está disponible")

    @field_validator("nombre")
    @classmethod
    def validar_nombre_no_vacio(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("El nombre del producto no puede quedar vacío.")
        return value.strip()


class ProductoCreate(ProductoBase):
    pass


class ProductoUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=1)
    descripcion: Optional[str] = None
    precio_base: Optional[float] = Field(default=None, ge=0.0)
    imagen_url: Optional[str] = None
    disponible: Optional[bool] = None
    activo: Optional[bool] = None

    @field_validator("nombre")
    @classmethod
    def validar_nombre_no_vacio(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and (not value or not value.strip()):
            raise ValueError("El nombre del producto no puede quedar vacío.")
        return value.strip() if value is not None else None


class ProductoRead(ProductoBase):
    id: int
    activo: bool = True

    model_config = ConfigDict(from_attributes=True)


class ProductoConCategoriasRead(ProductoRead):
    categorias: List[CategoriaRead] = []

    model_config = ConfigDict(from_attributes=True)


class AsociarCategoriaRequest(BaseModel):
    categoria_id: int = Field(..., gt=0, description="ID de la categoría a asociar")
