package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.pedido;

import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.detallePedido.DetallePedidoCreate;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Pedido;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Usuario;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.enums.Estado;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.enums.FormaPago;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record PedidoEdit(
        Long id,

        @NotNull(message = "La fecha es obligatoria")
        LocalDate fecha,

        @NotNull(message = "El estado es obligatorio")
        Estado estado,

        @NotNull(message = "La forma de pago es obligatoria")
        FormaPago formaPago,

        @NotNull(message = "El usuario es obligatorio")
        Long usuarioId,

        @NotEmpty(message = "El pedido debe tener al menos un detalle")
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