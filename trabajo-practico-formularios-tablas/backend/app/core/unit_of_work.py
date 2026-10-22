from typing import Callable
from sqlmodel import Session


class BaseUnitOfWork:
    """Clase base de Unit of Work que gestiona el ciclo de vida de la transacción.
    
    Abre la sesión al entrar en el bloque 'with', realiza commit si la operación
    fue exitosa, rollback en caso de cualquier excepción y garantiza el cierre
    de la sesión en el bloque finally.
    """

    def __init__(self, session_factory: Callable[[], Session]):
        self.session_factory = session_factory
        self.session: Session = None

    def __enter__(self):
        self.session = self.session_factory()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is not None:
                self.session.rollback()
            else:
                self.session.commit()
        finally:
            self.session.close()
