package com.gvega.utn.tupad.trabajos_practicos_p_4.service;

import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.categoria.CategoriaCreate;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.categoria.CategoriaDto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.categoria.CategoriaEdit;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Categoria;
import com.gvega.utn.tupad.trabajos_practicos_p_4.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

	private final CategoriaRepository categoriaRepository;

	public CategoriaService(CategoriaRepository categoriaRepository) {
		this.categoriaRepository = categoriaRepository;
	}

	public CategoriaDto create(CategoriaCreate dto) {
		return CategoriaDto.toDto(categoriaRepository.save(dto.toEntity()));
	}

	public CategoriaDto update(CategoriaEdit dto) {
		getEntity(dto.id());
		return CategoriaDto.toDto(categoriaRepository.save(dto.toEntity()));
	}

	public CategoriaDto getById(Long id) {
		return CategoriaDto.toDto(getEntity(id));
	}

	public List<CategoriaDto> getAll() {
		return categoriaRepository.findAll().stream()
				.filter(categoria -> !categoria.isEliminado())
				.map(CategoriaDto::toDto)
				.toList();
	}

	public void delete(Long id) {
		Categoria categoria = getEntity(id);
		categoria.setEliminado(true);
		categoriaRepository.save(categoria);
	}

	private Categoria getEntity(Long id) {
		return categoriaRepository.findById(id)
				.filter(categoria -> !categoria.isEliminado())
				.orElseThrow(() -> new RuntimeException("Categoria no encontrada: " + id));
	}
}
