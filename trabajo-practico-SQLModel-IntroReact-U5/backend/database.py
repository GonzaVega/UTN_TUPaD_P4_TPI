import os
from typing import Annotated, Generator
from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg:///tp5_productos"
)

engine = create_engine(DATABASE_URL, echo=True)


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
