package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.detallePedido;

import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.DetallePedido;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Pedido;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Producto;

public record DetallePedidoCreate(
		int cantidad,
		Long productoId) {

	public DetallePedido toEntity(Pedido pedido, Producto producto) {
		DetallePedido detalle = new DetallePedido();
		detalle.setCantidad(cantidad);
		detalle.setSubtotal(cantidad * producto.getPrecio());
		detalle.setPedido(pedido);
		detalle.setProducto(producto);
		return detalle;
	}
}
