class PedidoError(Exception):
    pass


class ProductoNoEncontrado(PedidoError):
    def __init__(self, producto_id: int):
        self.producto_id = producto_id
        super().__init__(f"Producto con id {producto_id} no encontrado o inactivo.")


class PedidoNoEncontrado(PedidoError):
    def __init__(self, pedido_id: int):
        self.pedido_id = pedido_id
        super().__init__(f"Pedido con id {pedido_id} no encontrado o eliminado.")


class PedidoInvalido(PedidoError):
    pass


class EstadoInvalido(PedidoError):
    pass


class ConflictoEstadoPedido(PedidoError):
    pass
