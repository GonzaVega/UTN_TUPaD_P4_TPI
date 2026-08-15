package com.gvega.utn.tupad.trabajos_practicos_p_4.service;

import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.detallePedido.DetallePedidoCreate;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.pedido.PedidoDto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.pedido.PedidoEdit;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Pedido;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Producto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Usuario;
import com.gvega.utn.tupad.trabajos_practicos_p_4.exception.ResourceNotFoundException;
import com.gvega.utn.tupad.trabajos_practicos_p_4.repository.PedidoRepository;
import com.gvega.utn.tupad.trabajos_practicos_p_4.repository.ProductoRepository;
import com.gvega.utn.tupad.trabajos_practicos_p_4.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PedidoService {

	private final PedidoRepository pedidoRepository;
	private final UsuarioRepository usuarioRepository;
	private final ProductoRepository productoRepository;

	public PedidoService(PedidoRepository pedidoRepository,
						 UsuarioRepository usuarioRepository,
						 ProductoRepository productoRepository) {
		this.pedidoRepository = pedidoRepository;
		this.usuarioRepository = usuarioRepository;
		this.productoRepository = productoRepository;
	}

	@Transactional
	public PedidoDto create(PedidoEdit dto) {
		Pedido pedido = dto.toEntity(getUsuario(dto.usuarioId()));
		addDetalles(pedido, dto.detallePedidos());
		pedido.calcularTotal();
		return PedidoDto.toDto(pedidoRepository.save(pedido));
	}

	@Transactional
	public PedidoDto update(PedidoEdit dto) {
		Pedido pedido = dto.toEntity(getUsuario(dto.usuarioId()));
		pedido.getDetallePedidos().clear();
		addDetalles(pedido, dto.detallePedidos());
		pedido.calcularTotal();
		return PedidoDto.toDto(pedidoRepository.save(pedido));
	}

	@Transactional(readOnly = true)
	public PedidoDto getById(Long id) {
		return PedidoDto.toDto(getEntity(id));
	}

	@Transactional(readOnly = true)
	public List<PedidoDto> getAll() {
		return pedidoRepository.findAll().stream()
				.filter(pedido -> !pedido.isEliminado())
				.map(PedidoDto::toDto)
				.toList();
	}

	public void delete(Long id) {
		Pedido pedido = getEntity(id);
		pedido.setEliminado(true);
		pedidoRepository.save(pedido);
	}

	private Pedido getEntity(Long id) {
		return pedidoRepository.findById(id)
				.filter(pedido -> !pedido.isEliminado())
				.orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado: " + id));
	}

	private Usuario getUsuario(Long usuarioId) {
		return usuarioRepository.findById(usuarioId)
				.filter(usuario -> !usuario.isEliminado())
				.orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + usuarioId));
	}

	private void addDetalles(Pedido pedido, List<DetallePedidoCreate> detalles) {
		if (detalles == null) {
			return;
		}
		for (DetallePedidoCreate detalle : detalles) {
			Producto producto = productoRepository.findById(detalle.productoId())
					.filter(p -> !p.isEliminado())
					.orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + detalle.productoId()));
			pedido.getDetallePedidos().add(detalle.toEntity(pedido, producto));
		}
	}
}
