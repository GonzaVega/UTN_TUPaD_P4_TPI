package com.gvega.utn.tupad.trabajos_practicos_p_4.controller;

import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.producto.ProductoCreate;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.producto.ProductoDto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.producto.ProductoEdit;
import com.gvega.utn.tupad.trabajos_practicos_p_4.service.ProductoService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<List<ProductoDto>> getAll() {
        return ResponseEntity.ok(productoService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDto> getById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(productoService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ProductoDto> create(@Valid @RequestBody ProductoCreate dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.create(dto));
    }

    @PutMapping
    public ResponseEntity<ProductoDto> update(@Valid @RequestBody ProductoEdit dto) {
        return ResponseEntity.ok(productoService.update(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        productoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}