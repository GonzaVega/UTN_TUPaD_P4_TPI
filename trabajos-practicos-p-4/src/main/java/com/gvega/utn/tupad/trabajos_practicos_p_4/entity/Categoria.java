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
@Table(name = "categoria")
public class Categoria extends Base {

	@Column(nullable = false)
	private String nombre;

	private String descripcion;

	@OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Producto> productos = new ArrayList<>();

	public void addProducto(Producto producto) {
		producto.setCategoria(this);
		this.productos.add(producto);
	}

	public void removeProducto(Producto producto) {
		this.productos.remove(producto);
		producto.setCategoria(null);
	}
}
