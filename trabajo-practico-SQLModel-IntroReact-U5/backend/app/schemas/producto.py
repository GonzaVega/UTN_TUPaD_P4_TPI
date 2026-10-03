from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProductoBase(BaseModel):
    """Contrato base con las validaciones requeridas por las consignas (RN-02, RN-03)."""
    nombre: str = Field(..., min_length=1, description="Nombre obligatorio del producto")
    descripcion: Optional[str] = Field(default=None, description="Descripción opcional")
    categoria: Optional[str] = Field(default=None, description="Categoría del producto")
    precio: float = Field(..., ge=0.0, description="Precio mayor o igual a 0")
    stock: int = Field(default=0, ge=0, description="Cantidad en stock")
    stock_minimo: int = Field(default=0, ge=0, description="Umbral para alerta de reposición")
    activo: bool = Field(default=True, description="Estado de activación del producto")

    @field_validator("nombre")
    @classmethod
    def validar_nombre_no_vacio(cls, value: str) -> str:
        """RN-02: El nombre del producto es obligatorio y no puede quedar vacío ni contener solo espacios."""
        if not value or not value.strip():
            raise ValueError("El nombre no puede quedar vacío ni contener solo espacios.")
        return value.strip()


class ProductoCreate(ProductoBase):
    """Esquema para la creación (POST). Exige todos los datos obligatorios."""
    pass


class ProductoUpdate(BaseModel):
    """Esquema para la actualización (PUT/PATCH). Campos opcionales para flexibilidad."""
    nombre: Optional[str] = Field(default=None, min_length=1)
    descripcion: Optional[str] = None
    categoria: Optional[str] = None
    precio: Optional[float] = Field(default=None, ge=0.0)
    stock: Optional[int] = Field(default=None, ge=0)
    stock_minimo: Optional[int] = Field(default=None, ge=0)
    activo: Optional[bool] = None

    @field_validator("nombre")
    @classmethod
    def validar_nombre_no_vacio(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and (not value or not value.strip()):
            raise ValueError("El nombre no puede quedar vacío ni contener solo espacios.")
        return value.strip() if value is not None else None


class ProductoResponse(ProductoBase):
    """Esquema de salida seguro con el identificador asignado por la base de datos."""
    id: int

    model_config = ConfigDict(from_attributes=True)


class ProductoStockResponse(BaseModel):
    """Esquema de salida para consulta de estado de stock y regla de negocio de alerta."""
    id: int
    nombre: str
    stock: int
    stock_minimo: int
    bajo_stock_minimo: bool
    activo: bool

    model_config = ConfigDict(from_attributes=True)
