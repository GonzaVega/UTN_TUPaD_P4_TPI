package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.producto;

import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.categoria.CategoriaDto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Producto;

public record ProductoDto(
		Long id,
		String nombre,
		Double precio,
		String descripcion,
		int stock,
		String imagen,
		Boolean disponible,
		CategoriaDto categoria) {

	public static ProductoDto toDto(Producto producto) {
		return new ProductoDto(
				producto.getId(),
				producto.getNombre(),
				producto.getPrecio(),
				producto.getDescripcion(),
				producto.getStock(),
				producto.getImagen(),
				producto.getDisponible(),
				producto.getCategoria() != null ? CategoriaDto.toDto(producto.getCategoria()) : null);
	}
}
