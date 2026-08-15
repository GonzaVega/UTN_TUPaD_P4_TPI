package com.gvega.utn.tupad.trabajos_practicos_p_4.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "producto")
public class Producto extends Base {

	@Column(nullable = false)
	private String nombre;

	@Column(nullable = false)
	private Double precio;

	private String descripcion;

	@Column(nullable = false)
	private int stock;

	private String imagen;

	@Column(nullable = false)
	private Boolean disponible;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "categoria_id")
	private Categoria categoria;

	@OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<DetallePedido> detallePedidos = new ArrayList<>();

	public void addDetallePedido(DetallePedido detalle) {
		detalle.setProducto(this);
		this.detallePedidos.add(detalle);
	}

	public void removeDetallePedido(DetallePedido detalle) {
		this.detallePedidos.remove(detalle);
		detalle.setProducto(null);
	}
}
