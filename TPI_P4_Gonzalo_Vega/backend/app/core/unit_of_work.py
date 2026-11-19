from typing import Callable, Optional
from sqlmodel import Session
from app.core.database import session_factory

class UnitOfWork:

    def __init__(self, factory: Callable[[], Session] = session_factory):
        self.session_factory = factory
        self.session: Optional[Session] = None

    def __enter__(self):
        self.session = self.session_factory()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.session is None:
            return
        try:
            if exc_type is not None:
                self.session.rollback()
            else:
                self.session.commit()
        finally:
            self.session.close()

