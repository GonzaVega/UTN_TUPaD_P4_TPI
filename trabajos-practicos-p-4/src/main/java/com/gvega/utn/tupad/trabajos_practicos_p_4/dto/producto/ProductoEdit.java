package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.producto;

import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Categoria;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Producto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record ProductoEdit(
        @NotNull(message = "El id es obligatorio")
        Long id,

        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotNull(message = "El precio es obligatorio")
        @Positive(message = "El precio debe ser mayor a 0")
        Double precio,

        @NotBlank(message = "La descripción es obligatoria")
        String descripcion,

        @PositiveOrZero(message = "El stock no puede ser negativo")
        int stock,

        String imagen,

        @NotNull(message = "La disponibilidad es obligatoria")
        Boolean disponible,

        @NotNull(message = "La categoría es obligatoria")
        Long categoriaId) {

    public Producto toEntity(Categoria categoria) {
        Producto producto = new Producto();
        producto.setId(id);
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