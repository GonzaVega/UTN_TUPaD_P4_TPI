import { api } from "@/shared/api/api"
import type { LoginFormData, RegisterFormData, UsuarioAdminItem, UsuarioAuth } from "../types/auth.types"

export const authService = {
  login: async (credentials: LoginFormData): Promise<UsuarioAuth> => {
    const formData = new URLSearchParams()
    formData.append("username", credentials.username)
    formData.append("password", credentials.password)

    await api.post("/auth/token", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })

    const response = await api.get<UsuarioAuth>("/auth/me")
    return response.data
  },

  register: async (data: RegisterFormData): Promise<UsuarioAuth> => {
    const response = await api.post<UsuarioAuth>("/auth/register", data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout")
  },

  getMe: async (): Promise<UsuarioAuth> => {
    const response = await api.get<UsuarioAuth>("/auth/me")
    return response.data
  },

  getUsers: async (): Promise<UsuarioAdminItem[]> => {
    const response = await api.get<UsuarioAdminItem[]>("/admin/usuarios")
    return response.data
  },

  activateUser: async (id: number): Promise<void> => {
    await api.post(`/admin/usuarios/${id}/activar`)
  },

  deactivateUser: async (id: number): Promise<void> => {
    await api.post(`/admin/usuarios/${id}/desactivar`)
  },
}

