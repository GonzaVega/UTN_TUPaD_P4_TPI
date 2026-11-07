from sqlmodel import SQLModel
from app.modules.usuarios.schemas import UserCreate, UserPublic  # noqa: F401


class MessageResponse(SQLModel):
    message: str

