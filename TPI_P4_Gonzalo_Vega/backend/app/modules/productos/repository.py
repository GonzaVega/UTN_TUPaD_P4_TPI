from typing import List, Optional, Tuple
from sqlmodel import Session, col, func, select
from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(session, Producto)

    def search(
        self,
        skip: int = 0,
        limit: int = 20,
        search_query: Optional[str] = None,
        categoria_id: Optional[int] = None,
        disponible: Optional[bool] = None,
    ) -> Tuple[int, List[Producto]]:
        # Filtra siempre los productos con baja lógica
        conditions = [Producto.activo == True]  # noqa: E712

        if search_query:
            conditions.append(col(Producto.nombre).ilike(f"%{search_query.strip()}%"))

        if categoria_id is not None:
            conditions.append(Producto.categoria_id == categoria_id)

        if disponible is not None:
            conditions.append(Producto.disponible == disponible)

        count_statement = select(func.count(Producto.id)).where(*conditions)
        total = self.session.exec(count_statement).one()

        statement = (
            select(Producto)
            .where(*conditions)
            .order_by(Producto.id)
            .offset(skip)
            .limit(limit)
        )
        items = list(self.session.exec(statement).all())
        return total, items

