package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.producto;

import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Categoria;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Producto;

public record ProductoCreate(
		String nombre,
		Double precio,
		String descripcion,
		int stock,
		String imagen,
		Boolean disponible,
		Long categoriaId) {

	public Producto toEntity(Categoria categoria) {
		Producto producto = new Producto();
		producto.setNombre(nombre);
		producto.setPrecio(precio);
		producto.setDescripcion(descripcion);
		producto.setStock(stock);
		producto.setImagen(imagen);
		producto.setDisponible(disponible);
		producto.setCategoria(categoria);
		return producto;
	}
}
