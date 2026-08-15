package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.categoria;

import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Categoria;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CategoriaEdit(
        @NotNull(message = "El id es obligatorio")
        Long id,

        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "La descripción es obligatoria")
        String descripcion) {

    public Categoria toEntity() {
        Categoria categoria = new Categoria();
        categoria.setId(id);
        categoria.setNombre(nombre);
        categoria.setDescripcion(descripcion);
        return categoria;
    }
}