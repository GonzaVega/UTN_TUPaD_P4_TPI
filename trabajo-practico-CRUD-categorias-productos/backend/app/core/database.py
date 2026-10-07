import os
from typing import Annotated, Generator
from dotenv import load_dotenv
from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tp6.db")

# Si se usa SQLite, se requiere el argumento check_same_thread: False para FastAPI
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args=connect_args
)


def init_db() -> None:
    """Crea todas las tablas definidas en los modelos SQLModel."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Generador de sesión de base de datos para inyección de dependencias."""
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
