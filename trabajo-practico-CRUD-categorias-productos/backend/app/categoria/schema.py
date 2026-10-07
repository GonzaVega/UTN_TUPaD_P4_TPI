from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class CategoriaBase(BaseModel):
    nombre: str = Field(..., min_length=1, description="Nombre de la categoría")
    descripcion: Optional[str] = Field(default=None, description="Descripción opcional")

    @field_validator("nombre")
    @classmethod
    def validar_nombre_no_vacio(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("El nombre de la categoría no puede quedar vacío.")
        return value.strip()


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=1)
    descripcion: Optional[str] = None

    @field_validator("nombre")
    @classmethod
    def validar_nombre_no_vacio(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and (not value or not value.strip()):
            raise ValueError("El nombre de la categoría no puede quedar vacío.")
        return value.strip() if value is not None else None


class CategoriaRead(CategoriaBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
