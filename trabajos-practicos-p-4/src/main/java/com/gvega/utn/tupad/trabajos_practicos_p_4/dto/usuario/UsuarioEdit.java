package com.gvega.utn.tupad.trabajos_practicos_p_4.dto.usuario;

import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Usuario;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.enums.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioEdit(
        @NotNull(message = "El id es obligatorio")
        Long id,

        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "El apellido es obligatorio")
        String apellido,

        @NotBlank(message = "El mail es obligatorio")
        @Email(message = "El mail no tiene un formato válido")
        String mail,

        String celular,

        @NotBlank(message = "La contraseña es obligatoria")
				@Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
        String contrasena,

        @NotNull(message = "El rol es obligatorio")
        Rol rol) {

    public Usuario toEntity() {
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setMail(mail);
        usuario.setCelular(celular);
        usuario.setContrasena(contrasena);
        usuario.setRol(rol);
        return usuario;
    }
}