from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class IngredienteBase(BaseModel):
    nombre: str = Field(..., min_length=1, description="Nombre del ingrediente")

    @field_validator("nombre")
    @classmethod
    def validar_nombre_no_vacio(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("El nombre del ingrediente no puede quedar vacío.")
        return value.strip()


class IngredienteCreate(IngredienteBase):
    pass


class IngredienteUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=1)
    activo: Optional[bool] = None

    @field_validator("nombre")
    @classmethod
    def validar_nombre_no_vacio(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and (not value or not value.strip()):
            raise ValueError("El nombre del ingrediente no puede quedar vacío.")
        return value.strip() if value is not None else None


class IngredienteRead(IngredienteBase):
    id: int
    activo: bool = True

    model_config = ConfigDict(from_attributes=True)
