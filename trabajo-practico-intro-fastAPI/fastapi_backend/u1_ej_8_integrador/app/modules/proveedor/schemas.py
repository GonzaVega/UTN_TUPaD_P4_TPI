from pydantic import BaseModel, Field
from typing import Optional


class ProveedorBase(BaseModel):
    codigo: str = Field(..., min_length=1)
    razon_social: str = Field(..., min_length=3)
    cuit: str = Field(..., min_length=11, max_length=15)
    email: str = Field(default='')
    telefono: str = Field(default='')
    activo: bool = Field(default=True)


class ProveedorCreate(ProveedorBase):
    pass  # para crear un proveedor nuevo, pedimos los atributos del Base.


class ProveedorUpdate(BaseModel):
    # Opcional: Se usa si en el futuro se implementa PATCH (actualización parcial)
    codigo: Optional[str] = Field(None, min_length=1)
    razon_social: Optional[str] = Field(None, min_length=3)
    cuit: Optional[str] = Field(None, min_length=11, max_length=15)
    email: Optional[str] = Field(None)
    telefono: Optional[str] = Field(None)
    activo: Optional[bool] = Field(None)


class ProveedorRead(ProveedorBase):
    id: int  # Al Base se le agrega el id
