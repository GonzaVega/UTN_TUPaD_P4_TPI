package com.gvega.utn.tupad.trabajos_practicos_p_4.entity;

import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.enums.Rol;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuario")
public class Usuario extends Base {

	@Column(nullable = false)
	private String nombre;

	@Column(nullable = false)
	private String apellido;

	@Column(nullable = false, unique = true)
	private String mail;

	private String celular;

	@Column(nullable = false)
	private String contrasena;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Rol rol;

	@OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Pedido> pedidos = new ArrayList<>();

	public void addPedido(Pedido pedido) {
		pedido.setUsuario(this);
		this.pedidos.add(pedido);
	}

	public void removePedido(Pedido pedido) {
		this.pedidos.remove(pedido);
		pedido.setUsuario(null);
	}
}
