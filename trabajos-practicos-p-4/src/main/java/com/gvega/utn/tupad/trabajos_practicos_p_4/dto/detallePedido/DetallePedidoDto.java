package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.detallePedido;

import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.producto.ProductoDto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.DetallePedido;

public record DetallePedidoDto(
		Long id,
		int cantidad,
		Double subtotal,
		ProductoDto producto) {

	public static DetallePedidoDto toDto(DetallePedido detalle) {
		return new DetallePedidoDto(
				detalle.getId(),
				detalle.getCantidad(),
				detalle.getSubtotal(),
				detalle.getProducto() != null ? ProductoDto.toDto(detalle.getProducto()) : null);
	}
}
