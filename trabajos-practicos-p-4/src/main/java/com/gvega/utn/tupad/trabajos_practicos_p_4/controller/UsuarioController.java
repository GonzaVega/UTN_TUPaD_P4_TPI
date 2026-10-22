package com.gvega.utn.tupad.trabajos_practicos_p_4.controller;

import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.usuario.UsuarioCreate;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.usuario.UsuarioDto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.usuario.UsuarioEdit;
import com.gvega.utn.tupad.trabajos_practicos_p_4.service.UsuarioService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDto>> getAll() {
        return ResponseEntity.ok(usuarioService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDto> getById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(usuarioService.getById(id));
    }

    @GetMapping("/mail/{mail}")
    public ResponseEntity<UsuarioDto> getByMail(@PathVariable("mail") String mail) {
      return ResponseEntity.ok(usuarioService.getByMail(mail));
    }

    @PostMapping
    public ResponseEntity<UsuarioDto> create(@Valid @RequestBody UsuarioCreate dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.create(dto));
    }

    @PutMapping
    public ResponseEntity<UsuarioDto> update(@Valid @RequestBody UsuarioEdit dto) {
        return ResponseEntity.ok(usuarioService.update(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}