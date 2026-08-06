package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.categoria;

import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Categoria;

public record CategoriaCreate(
		String nombre,
		String descripcion) {

	public Categoria toEntity() {
		Categoria categoria = new Categoria();
		categoria.setNombre(nombre);
		categoria.setDescripcion(descripcion);
		return categoria;
	}
}
