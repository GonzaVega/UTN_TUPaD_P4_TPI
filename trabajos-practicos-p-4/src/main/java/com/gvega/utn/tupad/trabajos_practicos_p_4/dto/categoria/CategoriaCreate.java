package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.categoria;

import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Categoria;

import jakarta.validation.constraints.NotBlank;

public record CategoriaCreate(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "La descripción es obligatoria")
        String descripcion) {

    public Categoria toEntity() {
        Categoria categoria = new Categoria();
        categoria.setNombre(nombre);
        categoria.setDescripcion(descripcion);
        return categoria;
    }
}