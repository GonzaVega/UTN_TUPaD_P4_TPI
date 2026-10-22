package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.usuario;

import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Usuario;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.enums.Rol;

public record UsuarioDto(
		Long id,
		String nombre,
		String apellido,
		String mail,
		String celular,
		Rol rol) {

	public static UsuarioDto toDto(Usuario usuario) {
		return new UsuarioDto(
				usuario.getId(),
				usuario.getNombre(),
				usuario.getApellido(),
				usuario.getMail(),
				usuario.getCelular(),
				usuario.getRol());
	}
}
