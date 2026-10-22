from datetime import datetime, timezone
from typing import List, Optional
from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.pedidos.models import DetallePedido, Pedido
from app.producto.model import Producto


class PedidoRepository(BaseRepository[Pedido]):
    """Repositorio específico para la entidad Pedido."""

    def __init__(self, session: Session):
        super().__init__(session, Pedido)

    def get_by_id(self, entity_id: int) -> Optional[Pedido]:
        pedido = self.session.get(self.model, entity_id)
        if pedido and pedido.deleted_at is None:
            return pedido
        return None

    def get_all(self) -> List[Pedido]:
        query = (
            select(self.model)
            .where(Pedido.deleted_at.is_(None))
            .order_by(Pedido.id.desc())
        )
        return list(self.session.exec(query).all())

    def delete_logical(self, pedido: Pedido) -> None:
        pedido.deleted_at = datetime.now(timezone.utc)
        self.session.add(pedido)
        self.session.flush()


class DetallePedidoRepository(BaseRepository[DetallePedido]):
    """Repositorio para la entidad DetallePedido."""

    def __init__(self, session: Session):
        super().__init__(session, DetallePedido)

    def get_by_pedido_id(self, pedido_id: int) -> List[DetallePedido]:
        query = select(self.model).where(DetallePedido.pedido_id == pedido_id)
        return list(self.session.exec(query).all())


class ProductoRepository(BaseRepository[Producto]):
    """Repositorio para consultar productos requeridos al crear un pedido."""

    def __init__(self, session: Session):
        super().__init__(session, Producto)

    def get_by_id(self, entity_id: int) -> Optional[Producto]:
        producto = self.session.get(self.model, entity_id)
        if producto and producto.activo:
            return producto
        return None
