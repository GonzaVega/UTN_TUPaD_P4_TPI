package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.categoria;

import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Categoria;

public record CategoriaDto(
		Long id,
		String nombre,
		String descripcion) {

	public static CategoriaDto toDto(Categoria categoria) {
		return new CategoriaDto(
				categoria.getId(),
				categoria.getNombre(),
				categoria.getDescripcion());
	}
}
