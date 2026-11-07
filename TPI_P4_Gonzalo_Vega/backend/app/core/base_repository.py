from typing import Generic, List, Optional, Type, TypeVar
from sqlmodel import Session, select

T = TypeVar("T")


class BaseRepository(Generic[T]):
    """Repositorio genérico base con operaciones CRUD elementales sobre la sesión compartida.

    No contiene reglas de negocio ni invoca a session.commit().
    """

    def __init__(self, session: Session, model: Type[T]):
        self.session = session
        self.model = model

    def get_by_id(self, entity_id: int) -> Optional[T]:
        return self.session.get(self.model, entity_id)

    def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        statement = select(self.model).offset(skip).limit(limit)
        return list(self.session.exec(statement).all())

    def add(self, entity: T) -> T:
        self.session.add(entity)
        self.session.flush()
        self.session.refresh(entity)
        return entity

    def delete(self, entity: T) -> None:
        self.session.delete(entity)
        self.session.flush()

