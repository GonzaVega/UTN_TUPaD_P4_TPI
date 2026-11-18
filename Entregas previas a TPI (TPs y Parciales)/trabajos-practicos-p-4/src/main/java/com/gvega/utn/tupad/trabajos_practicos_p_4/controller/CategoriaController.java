package com.gvega.utn.tupad.trabajos_practicos_p_4.controller;

import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.categoria.CategoriaCreate;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.categoria.CategoriaDto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.categoria.CategoriaEdit;
import com.gvega.utn.tupad.trabajos_practicos_p_4.service.CategoriaService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaDto>> getAll() {
        return ResponseEntity.ok(categoriaService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDto> getById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(categoriaService.getById(id));
    }

    @PostMapping
    public ResponseEntity<CategoriaDto> create(@Valid @RequestBody CategoriaCreate dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.create(dto));
    }

    @PutMapping
    public ResponseEntity<CategoriaDto> update(@Valid @RequestBody CategoriaEdit dto) {
        return ResponseEntity.ok(categoriaService.update(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        categoriaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}