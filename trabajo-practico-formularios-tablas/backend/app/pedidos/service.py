from typing import List
from app.pedidos.exceptions import (
    ConflictoEstadoPedido,
    PedidoInvalido,
    PedidoNoEncontrado,
    ProductoNoEncontrado,
)
from app.pedidos.models import DetallePedido, Pedido
from app.pedidos.schemas import (
    DetallePedidoRead,
    PedidoCreate,
    PedidoDetailRead,
    PedidoRead,
)
from app.pedidos.unit_of_work import PedidoUnitOfWork


class PedidoService:
    """Servicio de lógica de negocio para pedidos y detalles.
    
    Aplica las reglas de negocio (RN-12, RN-13, RN-14, RN-15, RN-16)
    y ejecuta cada caso de uso dentro de una transacción gestionada
    por el Unit of Work.
    """

    def __init__(self, uow: PedidoUnitOfWork):
        self.uow = uow

    def crear(self, data: PedidoCreate) -> PedidoDetailRead:
        if not data.detalles:
            raise PedidoInvalido("El pedido debe contener al menos un detalle.")

        # RN-12: validación de productos no repetidos
        productos_set = set()
        for item in data.detalles:
            if item.producto_id in productos_set:
                raise PedidoInvalido(
                    f"El producto con ID {item.producto_id} está duplicado en los detalles."
                )
            productos_set.add(item.producto_id)

        with self.uow as uow:
            # 1. Crear el pedido inicial con total 0 y estado PENDIENTE
            pedido = uow.pedidos.create(Pedido(estado="PENDIENTE", total=0.0))

            total_acumulado = 0.0
            detalles_resultado: List[DetallePedidoRead] = []

            # 2. Procesar cada detalle en la misma transacción
            for item in data.detalles:
                if item.cantidad < 1:
                    raise PedidoInvalido("La cantidad de cada producto debe ser mayor o igual a 1.")

                producto = uow.productos.get_by_id(item.producto_id)
                if producto is None:
                    # Al lanzar la excepción, el UnitOfWork realiza rollback automático
                    raise ProductoNoEncontrado(item.producto_id)

                subtotal = item.cantidad * producto.precio_base
                total_acumulado += subtotal

                detalle = uow.detalles.create(
                    DetallePedido(
                        pedido_id=pedido.id,
                        producto_id=producto.id,
                        cantidad=item.cantidad,
                        precio_unitario=producto.precio_base,
                    )
                )

                detalles_resultado.append(
                    DetallePedidoRead(
                        pedido_id=pedido.id,
                        producto_id=producto.id,
                        cantidad=item.cantidad,
                        precio_unitario=producto.precio_base,
                    )
                )

            # 3. Asignar el total calculado al pedido
            pedido.total = round(total_acumulado, 2)

            # 4. Validar y construir la respuesta dentro del bloque with antes de que la sesión cierre
            return PedidoDetailRead(
                id=pedido.id,
                fecha=pedido.fecha,
                estado=pedido.estado,
                total=pedido.total,
                deleted_at=pedido.deleted_at,
                detalles=detalles_resultado,
            )

    def obtener_todos(self) -> List[PedidoRead]:
        with self.uow as uow:
            pedidos = uow.pedidos.get_all()
            return [PedidoRead.model_validate(p) for p in pedidos]

    def obtener_por_id(self, pedido_id: int) -> PedidoDetailRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado(pedido_id)

            detalles = uow.detalles.get_by_pedido_id(pedido.id)
            detalles_read = [
                DetallePedidoRead.model_validate(d) for d in detalles
            ]

            return PedidoDetailRead(
                id=pedido.id,
                fecha=pedido.fecha,
                estado=pedido.estado,
                total=pedido.total,
                deleted_at=pedido.deleted_at,
                detalles=detalles_read,
            )

    def actualizar_estado(self, pedido_id: int, nuevo_estado: str) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado(pedido_id)

            # Impedir cambiar estado si ya se encuentra en estado terminal
            if pedido.estado in {"ENTREGADO", "CANCELADO"}:
                raise ConflictoEstadoPedido(
                    f"No se puede modificar un pedido en estado terminal '{pedido.estado}'."
                )

            pedido.estado = nuevo_estado
            return PedidoRead.model_validate(pedido)

    def eliminar_logico(self, pedido_id: int) -> None:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado(pedido_id)

            uow.pedidos.delete_logical(pedido)
