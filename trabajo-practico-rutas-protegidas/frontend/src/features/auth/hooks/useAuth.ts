import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "../store/authStore"
import { authService } from "../services/authService"
import type { RegisterFormData, UsuarioAdminItem } from "../types/auth.types"
import { useNotificationStore } from "@/store/notificationStore"

export const useAuth = () => {
  const {
    user,
    checking,
    error,
    login,
    logout,
    checkAuth,
    checkSession,
    clearSession,
  } = useAuthStore()
  const showNotification = useNotificationStore((state) => state.showNotification)

  const register = async (data: RegisterFormData) => {
    const res = await authService.register(data)
    showNotification("Cuenta registrada exitosamente. Inicia sesión.", "success")
    return res
  }

  const isAuthenticated = !!user
  const isAdmin = user?.roles.includes("admin") ?? false

  return {
    user,
    checking,
    error,
    login,
    logout,
    register,
    checkAuth,
    checkSession,
    clearSession,
    isAuthenticated,
    isAdmin,
  }
}

export const useAdminUsers = () => {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)

  const query = useQuery<UsuarioAdminItem[]>({
    queryKey: ["admin-users"],
    queryFn: () => authService.getUsers(),
  })

  const activarMutation = useMutation({
    mutationFn: (id: number) => authService.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      showNotification("Usuario activado exitosamente", "success")
    },
    onError: (err: unknown) => {
      let msg = "Error al activar el usuario"
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { detail?: string } } }).response
        if (res?.data?.detail) msg = res.data.detail
      }
      showNotification(msg, "error")
    },
  })

  const desactivarMutation = useMutation({
    mutationFn: (id: number) => authService.deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      showNotification("Usuario desactivado exitosamente", "info")
    },
    onError: (err: unknown) => {
      let msg = "Error al desactivar el usuario"
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { detail?: string } } }).response
        if (res?.data?.detail) msg = res.data.detail
      }
      showNotification(msg, "error")
    },
  })

  return {
    users: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    activateUser: (id: number) => activarMutation.mutate(id),
    deactivateUser: (id: number) => desactivarMutation.mutate(id),
    isActivating: activarMutation.isPending,
    isDeactivating: desactivarMutation.isPending,
  }
}
