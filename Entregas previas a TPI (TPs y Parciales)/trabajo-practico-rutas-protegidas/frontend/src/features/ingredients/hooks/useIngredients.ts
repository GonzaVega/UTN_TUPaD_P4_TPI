import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getIngredientes,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente,
} from "../services/ingredienteService"
import type { Ingrediente, IngredienteFormData } from "../types/ingrediente"
import { useNotificationStore } from "@/store/notificationStore"

export const useIngredients = () => {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)

  const query = useQuery<Ingrediente[]>({
    queryKey: ["ingredientes"],
    queryFn: getIngredientes,
  })

  const createMutation = useMutation({
    mutationFn: (data: IngredienteFormData) => createIngrediente(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] })
      showNotification("Ingrediente creado con éxito", "success")
    },
    onError: (err: unknown) => {
      let msg = "Error al crear ingrediente"
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { detail?: string } } }).response
        if (res?.data?.detail) msg = res.data.detail
      }
      showNotification(msg, "error")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredienteFormData }) =>
      updateIngrediente({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] })
      showNotification("Ingrediente actualizado con éxito", "success")
    },
    onError: (err: unknown) => {
      let msg = "Error al actualizar ingrediente"
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { detail?: string } } }).response
        if (res?.data?.detail) msg = res.data.detail
      }
      showNotification(msg, "error")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteIngrediente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] })
      showNotification("Ingrediente eliminado", "info")
    },
    onError: (err: unknown) => {
      let msg = "Error al eliminar ingrediente"
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { detail?: string } } }).response
        if (res?.data?.detail) msg = res.data.detail
      }
      showNotification(msg, "error")
    },
  })

  return {
    ingredients: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createIngredient: createMutation.mutateAsync,
    updateIngredient: (id: number, data: IngredienteFormData) =>
      updateMutation.mutateAsync({ id, data }),
    deleteIngredient: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

