package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.detallePedido;

import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.DetallePedido;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Pedido;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Producto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DetallePedidoCreate(
        @Positive(message = "La cantidad debe ser mayor a 0")
        int cantidad,

        @NotNull(message = "El producto es obligatorio")
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