package com.gvega.utn.tupad.trabajos_practicos_p_4.controller;

import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.pedido.PedidoDto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.pedido.PedidoEdit;
import com.gvega.utn.tupad.trabajos_practicos_p_4.service.PedidoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public ResponseEntity<List<PedidoDto>> getAll() {
        return ResponseEntity.ok(pedidoService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDto> getById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(pedidoService.getById(id));
    }

    @PostMapping
    public ResponseEntity<PedidoDto> create(@Valid @RequestBody PedidoEdit dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.create(dto));
    }

    @PutMapping
    public ResponseEntity<PedidoDto> update(@Valid @RequestBody PedidoEdit dto) {
        return ResponseEntity.ok(pedidoService.update(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        pedidoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}