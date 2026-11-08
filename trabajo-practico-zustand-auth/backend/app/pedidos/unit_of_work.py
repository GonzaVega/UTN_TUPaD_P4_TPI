from typing import Callable
from sqlmodel import Session
from app.core.unit_of_work import BaseUnitOfWork
from app.pedidos.repository import (
    DetallePedidoRepository,
    PedidoRepository,
    ProductoRepository,
)


class PedidoUnitOfWork(BaseUnitOfWork):
    def __init__(self, session_factory: Callable[[], Session]):
        super().__init__(session_factory)
        self.pedidos: PedidoRepository = None
        self.detalles: DetallePedidoRepository = None
        self.productos: ProductoRepository = None

    def __enter__(self):
        super().__enter__()
        self.pedidos = PedidoRepository(self.session)
        self.detalles = DetallePedidoRepository(self.session)
        self.productos = ProductoRepository(self.session)
        return self
