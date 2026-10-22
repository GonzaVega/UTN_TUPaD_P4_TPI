from typing import Optional
from sqlmodel import Field, SQLModel


class Ingrediente(SQLModel, table=True):
    __tablename__ = "ingredientes"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, nullable=False)
    activo: bool = Field(default=True, nullable=False)
