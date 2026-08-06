package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.pedido;

import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.detallePedido.DetallePedidoDto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.usuario.UsuarioDto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Pedido;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.enums.Estado;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.enums.FormaPago;

import java.time.LocalDate;
import java.util.List;

public record PedidoDto(
		Long id,
		LocalDate fecha,
		Estado estado,
		Double total,
		FormaPago formaPago,
		UsuarioDto usuario,
		List<DetallePedidoDto> detallePedidos) {

	public static PedidoDto toDto(Pedido pedido) {
		List<DetallePedidoDto> detalles = pedido.getDetallePedidos().stream()
				.map(DetallePedidoDto::toDto)
				.toList();
		return new PedidoDto(
				pedido.getId(),
				pedido.getFecha(),
				pedido.getEstado(),
				pedido.getTotal(),
				pedido.getFormaPago(),
				pedido.getUsuario() != null ? UsuarioDto.toDto(pedido.getUsuario()) : null,
				detalles);
	}
}
