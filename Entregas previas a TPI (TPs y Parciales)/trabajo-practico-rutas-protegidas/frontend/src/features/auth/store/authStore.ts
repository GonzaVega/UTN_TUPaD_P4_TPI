import { create } from "zustand"
import { authService } from "../services/authService"
import type { LoginFormData, UsuarioAuth } from "../types/auth.types"

interface AuthState {
  user: UsuarioAuth | null
  checking: boolean
  error: string | null
  login: (emailOrCreds: string | LoginFormData, password?: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  checkSession: () => Promise<void>
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  checking: true,
  error: null,

  login: async (emailOrCreds: string | LoginFormData, password?: string) => {
    try {
      set({ error: null })
      const creds: LoginFormData =
        typeof emailOrCreds === "string"
          ? { username: emailOrCreds, password: password || "" }
          : emailOrCreds
      const user = await authService.login(creds)
      set({ user, checking: false, error: null })
    } catch (err: unknown) {
      let msg = "Error al iniciar sesión"
      if (err && typeof err === "object" && "response" in err) {
        const response = (err as { response?: { data?: { detail?: string } } }).response
        if (response?.data?.detail) {
          msg = response.data.detail
        }
      }
      set({ error: msg, checking: false })
      throw err
    }
  },

  logout: async () => {
    try {
      await authService.logout()
    } finally {
      set({ user: null, checking: false, error: null })
    }
  },

  checkAuth: async () => {
    set({ checking: true })
    try {
      const user = await authService.getMe()
      set({ user, checking: false, error: null })
    } catch {
      set({ user: null, checking: false })
    }
  },

  checkSession: async () => {
    set({ checking: true })
    try {
      const user = await authService.getMe()
      set({ user, checking: false, error: null })
    } catch {
      set({ user: null, checking: false })
    }
  },

  clearSession: () => {
    set({ user: null, checking: false, error: null })
  },
}))
