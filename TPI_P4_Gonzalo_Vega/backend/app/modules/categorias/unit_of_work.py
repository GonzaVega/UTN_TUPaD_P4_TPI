from typing import Optional
from app.core.unit_of_work import UnitOfWork
from app.modules.categorias.repository import CategoriaRepository

class CategoriaUnitOfWork(UnitOfWork):
    def __init__(self):
        super().__init__()
        self.categorias: Optional[CategoriaRepository] = None

    def __enter__(self):
        super().__enter__()
        self.categorias = CategoriaRepository(self.session)
        return self

