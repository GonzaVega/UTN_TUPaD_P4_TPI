package com.gvega.utn.tupad.trabajos_practicos_p_4.service;

import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.usuario.UsuarioCreate;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.usuario.UsuarioDto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.usuario.UsuarioEdit;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Usuario;
import com.gvega.utn.tupad.trabajos_practicos_p_4.exception.ResourceNotFoundException;
import com.gvega.utn.tupad.trabajos_practicos_p_4.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

	private final UsuarioRepository usuarioRepository;

	public UsuarioService(UsuarioRepository usuarioRepository) {
		this.usuarioRepository = usuarioRepository;
	}

	public UsuarioDto create(UsuarioCreate dto) {
		return UsuarioDto.toDto(usuarioRepository.save(dto.toEntity()));
	}

	public UsuarioDto update(UsuarioEdit dto) {
		getEntity(dto.id());
		return UsuarioDto.toDto(usuarioRepository.save(dto.toEntity()));
	}

	public UsuarioDto getById(Long id) {
		return UsuarioDto.toDto(getEntity(id));
	}

	public List<UsuarioDto> getAll() {
		return usuarioRepository.findAll().stream()
				.filter(usuario -> !usuario.isEliminado())
				.map(UsuarioDto::toDto)
				.toList();
	}

	public void delete(Long id) {
		Usuario usuario = getEntity(id);
		usuario.setEliminado(true);
		usuarioRepository.save(usuario);
	}

	private Usuario getEntity(Long id) {
		return usuarioRepository.findById(id)
				.filter(usuario -> !usuario.isEliminado())
				.orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
	}

	public UsuarioDto getByMail(String mail) {
    return UsuarioDto.toDto(usuarioRepository.findByMail(mail)
            .filter(usuario -> !usuario.isEliminado())
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + mail)));
}
}
