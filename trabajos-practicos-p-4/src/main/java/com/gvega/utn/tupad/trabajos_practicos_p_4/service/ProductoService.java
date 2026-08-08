package com.gvega.utn.tupad.trabajos_practicos_p_4.service;

import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.producto.ProductoCreate;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.producto.ProductoDto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.producto.ProductoEdit;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Categoria;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Producto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.repository.CategoriaRepository;
import com.gvega.utn.tupad.trabajos_practicos_p_4.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductoService {

	private final ProductoRepository productoRepository;
	private final CategoriaRepository categoriaRepository;

	public ProductoService(ProductoRepository productoRepository, CategoriaRepository categoriaRepository) {
		this.productoRepository = productoRepository;
		this.categoriaRepository = categoriaRepository;
	}

	@Transactional
	public ProductoDto create(ProductoCreate dto) {
		return ProductoDto.toDto(productoRepository.save(dto.toEntity(getCategoria(dto.categoriaId()))));
	}

	@Transactional
	public ProductoDto update(ProductoEdit dto) {
		getEntity(dto.id());
		return ProductoDto.toDto(productoRepository.save(dto.toEntity(getCategoria(dto.categoriaId()))));
	}

	@Transactional(readOnly = true)
	public ProductoDto getById(Long id) {
		return ProductoDto.toDto(getEntity(id));
	}

	@Transactional(readOnly = true)
	public List<ProductoDto> getAll() {
		return productoRepository.findAll().stream()
				.filter(producto -> !producto.isEliminado())
				.map(ProductoDto::toDto)
				.toList();
	}

	public void delete(Long id) {
		Producto producto = getEntity(id);
		producto.setEliminado(true);
		productoRepository.save(producto);
	}

	private Producto getEntity(Long id) {
		return productoRepository.findById(id)
				.filter(producto -> !producto.isEliminado())
				.orElseThrow(() -> new RuntimeException("Producto no encontrado: " + id));
	}

	private Categoria getCategoria(Long categoriaId) {
		return categoriaRepository.findById(categoriaId)
				.filter(categoria -> !categoria.isEliminado())
				.orElseThrow(() -> new RuntimeException("Categoria no encontrada: " + categoriaId));
	}
}
