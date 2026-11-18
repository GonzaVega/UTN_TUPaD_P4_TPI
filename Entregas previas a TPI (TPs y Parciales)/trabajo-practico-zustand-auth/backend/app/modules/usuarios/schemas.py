from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    nombre: str = Field(min_length=1)
    apellido: str = Field(min_length=1)
    email: EmailStr
    celular: Optional[str] = None
    password: str = Field(min_length=8)


class UserPublic(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: str
    celular: Optional[str] = None
    roles: List[str]
    created_at: datetime
    deleted_at: Optional[datetime] = None


class RolRead(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None


class MessageResponse(BaseModel):
    message: str

