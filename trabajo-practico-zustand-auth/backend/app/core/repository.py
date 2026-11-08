from typing import Generic, List, Optional, Type, TypeVar
from sqlmodel import Session, select

T = TypeVar("T")


class BaseRepository(Generic[T]):
    def __init__(self, session: Session, model: Type[T]):
        self.session = session
        self.model = model

    def create(self, entity: T) -> T:
        self.session.add(entity)
        self.session.flush()
        return entity

    def get_by_id(self, entity_id: int) -> Optional[T]:
        return self.session.get(self.model, entity_id)

    def get_all(self) -> List[T]:
        return list(self.session.exec(select(self.model)).all())

    def delete(self, entity: T) -> None:
        self.session.delete(entity)
