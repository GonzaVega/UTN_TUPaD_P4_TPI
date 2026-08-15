package com.gvega.utn.tupad.trabajos_practicos_p_4.entity;

import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.enums.Estado;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.enums.FormaPago;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pedido")
public class Pedido extends Base implements Calculable {

	@Column(nullable = false)
	private LocalDate fecha;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Estado estado;

	private Double total;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private FormaPago formaPago;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "usuario_id")
	private Usuario usuario;

	@OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<DetallePedido> detallePedidos = new ArrayList<>();

	public void addDetallePedido(int cantidad, Producto producto) {
		DetallePedido detalle = new DetallePedido();
		detalle.setCantidad(cantidad);
		detalle.setProducto(producto);
		detalle.setSubtotal(cantidad * producto.getPrecio());
		detalle.setPedido(this);
		this.detallePedidos.add(detalle);
		this.calcularTotal();
	}

	public DetallePedido findDetallePedidoByProducto(Producto producto) {
		return this.detallePedidos.stream()
				.filter(detalle -> producto.equals(detalle.getProducto()))
				.findFirst()
				.orElse(null);
	}

	public void deleteDetallePedidoByProducto(Producto producto) {
		this.detallePedidos.removeIf(detalle -> producto.equals(detalle.getProducto()));
		this.calcularTotal();
	}

	@Override
	public void calcularTotal() {
		this.total = this.detallePedidos.stream()
				.mapToDouble(DetallePedido::getSubtotal)
				.sum();
	}
}
