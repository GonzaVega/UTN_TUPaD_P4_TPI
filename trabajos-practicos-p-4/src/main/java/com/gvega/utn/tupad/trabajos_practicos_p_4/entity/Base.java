package com.gvega.utn.tupad.trabajos_practicos_p_4.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
public abstract class Base {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "eliminado", nullable = false)
	private boolean eliminado;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@PrePersist
	protected void prePersist() {
		this.eliminado = false;
		this.createdAt = LocalDateTime.now();
	}
}
