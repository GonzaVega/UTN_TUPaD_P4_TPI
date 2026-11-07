from datetime import datetime
from typing import Annotated, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class CategoriaBase(BaseModel):
    nombre: Annotated[str, Field(min_length=3, description="Nombre de la categoría (mínimo 3 caracteres)")]
    descripcion: Optional[str] = Field(default=None, description="Descripción opcional de la categoría")

    @field_validator("nombre")
    @classmethod
    def validar_nombre_no_vacio(cls, value: str) -> str:
        limpio = value.strip()
        if len(limpio) < 3:
            raise ValueError("El nombre de la categoría debe tener al menos 3 caracteres.")
        return limpio


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(CategoriaBase):
    pass


class CategoriaPublic(CategoriaBase):
    id: int
    activo: bool
    anulado_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
