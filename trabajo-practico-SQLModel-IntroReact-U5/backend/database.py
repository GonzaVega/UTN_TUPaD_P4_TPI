import os
from typing import Annotated, Generator
from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine
from dotenv import load_dotenv

# Cargar variables de entorno desde .env si existe
load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg:///tp5_productos"
)

# Engine único global. echo=True permite depurar las consultas SQL generadas
engine = create_engine(DATABASE_URL, echo=True)


def create_db_and_tables() -> None:
    """Crea las tablas definidas en los modelos de SQLModel si no existen."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Generador de sesión por cada petición HTTP para asegurar transacciones independientes."""
    with Session(engine) as session:
        yield session


# Inyección de dependencia tipada para usar directamente en los routers
SessionDep = Annotated[Session, Depends(get_session)]
