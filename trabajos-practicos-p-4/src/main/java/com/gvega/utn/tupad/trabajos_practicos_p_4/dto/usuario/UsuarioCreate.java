package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.usuario;

import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Usuario;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.enums.Rol;

public record UsuarioCreate(
		String nombre,
		String apellido,
		String mail,
		String celular,
		String contrasena,
		Rol rol) {

	public Usuario toEntity() {
		Usuario usuario = new Usuario();
		usuario.setNombre(nombre);
		usuario.setApellido(apellido);
		usuario.setMail(mail);
		usuario.setCelular(celular);
		usuario.setContrasena(contrasena);
		usuario.setRol(rol);
		return usuario;
	}
}
