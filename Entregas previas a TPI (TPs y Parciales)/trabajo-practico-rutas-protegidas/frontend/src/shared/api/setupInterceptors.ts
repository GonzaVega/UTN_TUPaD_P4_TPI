import axios from "axios"
import { api } from "./api"
import { useAuthStore } from "@/features/auth"
import { useNotificationStore } from "@/store/notificationStore"

export function setupInterceptors() {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error)) {
        const url = error.config?.url || ""
        const status = error.response?.status
        const isAuthPath =
          url.includes("/auth/token") ||
          url.includes("/auth/login") ||
          url.includes("/auth/me")

        if (status === 401 && !isAuthPath) {
          useAuthStore.getState().clearSession()
        } else if (status === 403) {
          useNotificationStore
            .getState()
            .showNotification(
              "Acceso denegado: no tienes permisos para esta acción",
              "error"
            )
        }
      }

      return Promise.reject(error)
    }
  )
}
