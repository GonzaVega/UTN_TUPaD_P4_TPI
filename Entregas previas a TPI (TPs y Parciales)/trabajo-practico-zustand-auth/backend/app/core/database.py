from typing import Annotated, Generator
from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine
from app.core.config import settings

connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args=connect_args,
)


def init_db() -> None:
    import app.modules.usuarios.models
    import app.categoria.model
    import app.producto.model
    import app.ingrediente.model
    import app.pedidos.models

    SQLModel.metadata.create_all(engine)
    from app.core.seed import seed_database
    with Session(engine) as session:
        seed_database(session)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
