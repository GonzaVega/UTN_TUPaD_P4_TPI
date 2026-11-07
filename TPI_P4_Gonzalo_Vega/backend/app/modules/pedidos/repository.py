from typing import Any, Dict, List, Optional, Tuple
from sqlmodel import Session, col, func, select
from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(session, Pedido)

    def list_by_usuario(
        self,
        usuario_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 20,
        estado: Optional[str] = None,
    ) -> Tuple[int, List[Pedido]]:
        conditions = []
        if usuario_id is not None:
            conditions.append(Pedido.usuario_id == usuario_id)
        if estado is not None:
            conditions.append(Pedido.estado == estado)

        count_stmt = select(func.count(Pedido.id))
        if conditions:
            count_stmt = count_stmt.where(*conditions)
        total = self.session.exec(count_stmt).one()

        stmt = select(Pedido)
        if conditions:
            stmt = stmt.where(*conditions)
        stmt = stmt.order_by(col(Pedido.created_at).desc()).offset(skip).limit(limit)

        items = list(self.session.exec(stmt).all())
        return total, items

    def count_by_estado(self) -> Dict[str, Any]:
        def get_count(est: str) -> int:
            return self.session.exec(
                select(func.count(Pedido.id)).where(Pedido.estado == est)
            ).one()

        pendientes = get_count("PENDIENTE")
        en_preparacion = get_count("EN_PREPARACION")
        entregados = get_count("ENTREGADO")
        cancelados = get_count("CANCELADO")

        pedidos_hoy = self.session.exec(
            select(func.count(Pedido.id)).where(
                func.date(Pedido.created_at) == func.current_date()
            )
        ).one()

        ingresos = self.session.exec(
            select(func.coalesce(func.sum(Pedido.total), 0.0)).where(
                Pedido.estado == "ENTREGADO"
            )
        ).one()

        return {
            "pendientes": pendientes,
            "en_preparacion": en_preparacion,
            "entregados": entregados,
            "cancelados": cancelados,
            "pedidos_hoy": pedidos_hoy,
            "ingresos_entregados": float(ingresos),
        }

