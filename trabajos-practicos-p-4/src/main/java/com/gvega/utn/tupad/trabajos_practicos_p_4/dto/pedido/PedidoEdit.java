package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.pedido;

import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.detallePedido.DetallePedidoCreate;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Pedido;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Usuario;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.enums.Estado;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.enums.FormaPago;

import java.time.LocalDate;
import java.util.List;

public record PedidoEdit(
		Long id,
		LocalDate fecha,
		Estado estado,
		FormaPago formaPago,
		Long usuarioId,
		List<DetallePedidoCreate> detallePedidos) {

	public Pedido toEntity(Usuario usuario) {
		Pedido pedido = new Pedido();
		pedido.setId(id);
		pedido.setFecha(fecha);
		pedido.setEstado(estado);
		pedido.setFormaPago(formaPago);
		pedido.setUsuario(usuario);
		return pedido;
	}
}
