from datetime import datetime, timezone
from typing import Dict, List, Optional, Set
from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.pedidos.schemas import (
    CambioEstado,
    DetallePedidoRead,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.productos.service import ProductoNoEncontrado
from app.modules.usuarios.models import Usuario

MAPA_TRANSICIONES: Dict[str, Set[str]] = {
    "PENDIENTE": {"EN_PREPARACION", "CANCELADO"},
    "EN_PREPARACION": {"ENTREGADO", "CANCELADO"},
    "ENTREGADO": set(),
    "CANCELADO": set(),
}

class PedidoNoEncontrado(Exception):
    def __init__(self, pedido_id: int):
        self.pedido_id = pedido_id
        super().__init__(f"Pedido con id {pedido_id} no encontrado")

class PedidoAjeno(Exception):
    def __init__(self, pedido_id: int):
        self.pedido_id = pedido_id
        super().__init__(f"No tiene permisos para acceder al pedido con id {pedido_id}")

class StockInsuficiente(Exception):
    def __init__(self, detalle: str):
        self.detalle = detalle
        super().__init__(detalle)

class ProductoNoDisponible(Exception):
    def __init__(self, detalle: str):
        self.detalle = detalle
        super().__init__(detalle)

class ProductoRepetido(Exception):
    def __init__(self, detalle: str):
        self.detalle = detalle
        super().__init__(detalle)

class TransicionInvalida(Exception):
    def __init__(self, detalle: str):
        self.detalle = detalle
        super().__init__(detalle)

def _to_pedido_read(p: Pedido) -> PedidoRead:
    detalles = [
        DetallePedidoRead(
            producto_id=d.producto_id,
            nombre_producto=d.nombre_producto,
            precio_unitario=d.precio_unitario,
            cantidad=d.cantidad,
            subtotal=d.subtotal,
        )
        for d in p.items
    ]
    return PedidoRead(
        id=p.id,
        usuario_id=p.usuario_id,
        estado=p.estado,
        forma_pago=p.forma_pago,
        direccion_entrega=p.direccion_entrega,
        notas=p.notas,
        total=p.total,
        created_at=p.created_at,
        updated_at=p.updated_at,
        items=detalles,
    )

class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork):
        self.uow = uow

    def crear_pedido(self, usuario_id: int, data: PedidoCreate) -> PedidoRead:
        productos_vistos = set()
        for item in data.items:
            if item.producto_id in productos_vistos:
                raise ProductoRepetido(
                    f"El producto con ID {item.producto_id} se encuentra duplicado en el pedido"
                )
            productos_vistos.add(item.producto_id)

        with self.uow as uow:
            ahora = datetime.now(timezone.utc)
            pedido = Pedido(
                usuario_id=usuario_id,
                estado="PENDIENTE",
                forma_pago=data.forma_pago,
                direccion_entrega=data.direccion_entrega.strip(),
                notas=data.notas.strip() if data.notas else None,
                total=0.0,
                created_at=ahora,
                updated_at=ahora,
            )
            uow.pedidos.add(pedido)

            total_acumulado = 0.0
            detalles_creados: List[DetallePedido] = []

            for item in data.items:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is None or not producto.activo:
                    raise ProductoNoEncontrado(item.producto_id)
                if not producto.disponible:
                    raise ProductoNoDisponible(
                        f"El producto '{producto.nombre}' no se encuentra disponible para la venta"
                    )
                if producto.stock < item.cantidad:
                    raise StockInsuficiente(
                        f"Stock insuficiente para '{producto.nombre}'. Solicitado: {item.cantidad}, Disponible: {producto.stock}"
                    )

                producto.stock -= item.cantidad

                subtotal = round(producto.precio_base * item.cantidad, 2)
                total_acumulado += subtotal

                detalle = DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=producto.id,
                    cantidad=item.cantidad,
                    nombre_producto=producto.nombre,
                    precio_unitario=producto.precio_base,
                    subtotal=subtotal,
                )
                uow.session.add(detalle)
                detalles_creados.append(detalle)

            pedido.total = round(total_acumulado, 2)
            uow.session.flush()
            uow.session.refresh(pedido)
            return _to_pedido_read(pedido)

    def listar_pedidos(
        self,
        current_user: Usuario,
        skip: int = 0,
        limit: int = 20,
        estado: Optional[str] = None,
    ) -> PedidosPaginados:
        with self.uow as uow:
            uid = None if current_user.role == "admin" else current_user.id
            total, pedidos = uow.pedidos.list_by_usuario(
                usuario_id=uid,
                skip=skip,
                limit=limit,
                estado=estado,
            )
            items = [_to_pedido_read(p) for p in pedidos]
            return PedidosPaginados(total=total, items=items)

    def obtener_resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            stats = uow.pedidos.count_by_estado()
            return ResumenPedidos(**stats)

    def obtener_detalle(self, pedido_id: int, current_user: Usuario) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado(pedido_id)

            if current_user.role != "admin" and pedido.usuario_id != current_user.id:
                raise PedidoAjeno(pedido_id)

            return _to_pedido_read(pedido)

    def cambiar_estado(self, pedido_id: int, data: CambioEstado) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado(pedido_id)

            permitidos = MAPA_TRANSICIONES.get(pedido.estado, set())
            if data.estado not in permitidos:
                raise TransicionInvalida(
                    f"Transición de estado inválida: no se puede pasar de '{pedido.estado}' a '{data.estado}'"
                )

            if data.estado == "CANCELADO":
                for detalle in pedido.items:
                    prod = uow.productos.get_by_id(detalle.producto_id)
                    if prod is not None:
                        prod.stock += detalle.cantidad

            pedido.estado = data.estado
            pedido.updated_at = datetime.now(timezone.utc)
            uow.session.flush()
            uow.session.refresh(pedido)
            return _to_pedido_read(pedido)

    def cancelar_pedido_cliente(self, pedido_id: int, current_user: Usuario) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado(pedido_id)

            if pedido.usuario_id != current_user.id:
                raise PedidoAjeno(pedido_id)

            if pedido.estado != "PENDIENTE":
                raise TransicionInvalida(
                    f"El pedido no se puede cancelar porque su estado actual es '{pedido.estado}' (solo permitido en PENDIENTE)"
                )

            for detalle in pedido.items:
                prod = uow.productos.get_by_id(detalle.producto_id)
                if prod is not None:
                    prod.stock += detalle.cantidad

            pedido.estado = "CANCELADO"
            pedido.updated_at = datetime.now(timezone.utc)
            uow.session.flush()
            uow.session.refresh(pedido)
            return _to_pedido_read(pedido)

