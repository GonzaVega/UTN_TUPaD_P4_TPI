import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../services/productoService"
import type { Producto, ProductoFormData } from "../types/producto"
import { useNotificationStore } from "@/store/notificationStore"

export const useProducts = () => {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)

  const query = useQuery<Producto[]>({
    queryKey: ["productos"],
    queryFn: getProductos,
  })

  const createMutation = useMutation({
    mutationFn: (data: ProductoFormData) => createProducto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
      showNotification("Producto creado con éxito", "success")
    },
    onError: (err: unknown) => {
      let msg = "Error al crear producto"
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { detail?: string } } }).response
        if (res?.data?.detail) msg = res.data.detail
      }
      showNotification(msg, "error")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoFormData }) =>
      updateProducto({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
      showNotification("Producto actualizado con éxito", "success")
    },
    onError: (err: unknown) => {
      let msg = "Error al actualizar producto"
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { detail?: string } } }).response
        if (res?.data?.detail) msg = res.data.detail
      }
      showNotification(msg, "error")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
      showNotification("Producto eliminado", "info")
    },
    onError: (err: unknown) => {
      let msg = "Error al eliminar producto"
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { detail?: string } } }).response
        if (res?.data?.detail) msg = res.data.detail
      }
      showNotification(msg, "error")
    },
  })

  return {
    products: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createProduct: createMutation.mutateAsync,
    updateProduct: (id: number, data: ProductoFormData) =>
      updateMutation.mutateAsync({ id, data }),
    deleteProduct: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

