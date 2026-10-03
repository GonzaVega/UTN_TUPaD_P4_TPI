from typing import Optional
from sqlmodel import Field, SQLModel


class Producto(SQLModel, table=True):
    """
    Modelo de persistencia para la tabla 'productos' en PostgreSQL.
    Cumple con RN-01, RN-02, RN-03, RN-05 y RN-06.
    """
    __tablename__ = "productos"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, nullable=False, min_length=1)
    descripcion: Optional[str] = Field(default=None)
    categoria: Optional[str] = Field(default=None, index=True)
    precio: float = Field(ge=0.0, nullable=False)
    stock: int = Field(default=0, ge=0)
    stock_minimo: int = Field(default=0, ge=0)
    activo: bool = Field(default=True, nullable=False)
