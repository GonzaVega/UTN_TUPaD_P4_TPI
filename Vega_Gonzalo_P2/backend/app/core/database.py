import os
from typing import Annotated, Generator
from dotenv import load_dotenv
from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg:///foodstore_p2"
)

engine = create_engine(
    DATABASE_URL,
    echo=False
)


def init_db() -> None:
    import app.modules.unidades_medida.model  # noqa: F401
    import app.modules.categorias.model  # noqa: F401
    import app.modules.productos.model  # noqa: F401

    SQLModel.metadata.create_all(engine)

    from app.core.seed import seed_database
    with Session(engine) as session:
        seed_database(session)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
