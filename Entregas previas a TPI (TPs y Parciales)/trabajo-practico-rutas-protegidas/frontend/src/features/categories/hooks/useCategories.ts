import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categoriaService"
import type { Categoria, CategoriaFormData } from "../types/categoria"
import { useNotificationStore } from "@/store/notificationStore"

export const useCategories = () => {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)

  const query = useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  })

  const createMutation = useMutation({
    mutationFn: (data: CategoriaFormData) => createCategoria(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
      showNotification("Categoría creada con éxito", "success")
    },
    onError: (err: unknown) => {
      let msg = "Error al crear categoría"
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { detail?: string } } }).response
        if (res?.data?.detail) msg = res.data.detail
      }
      showNotification(msg, "error")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaFormData }) =>
      updateCategoria({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
      showNotification("Categoría actualizada con éxito", "success")
    },
    onError: (err: unknown) => {
      let msg = "Error al actualizar categoría"
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { detail?: string } } }).response
        if (res?.data?.detail) msg = res.data.detail
      }
      showNotification(msg, "error")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategoria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
      showNotification("Categoría eliminada", "info")
    },
    onError: (err: unknown) => {
      let msg = "Error al eliminar categoría"
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { detail?: string } } }).response
        if (res?.data?.detail) msg = res.data.detail
      }
      showNotification(msg, "error")
    },
  })

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createCategory: createMutation.mutateAsync,
    updateCategory: (id: number, data: CategoriaFormData) =>
      updateMutation.mutateAsync({ id, data }),
    deleteCategory: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

