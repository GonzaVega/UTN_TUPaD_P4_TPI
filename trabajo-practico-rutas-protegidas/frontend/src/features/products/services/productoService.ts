import type { Producto, ProductoFormData } from "../types/producto"
import { api } from "@/shared/api"

export const getProductos = async (): Promise<Producto[]> => {
  const res = await api.get<Producto[]>("/productos/")
  return res.data
}

export const getProductoById = async (id: number): Promise<Producto> => {
  const res = await api.get<Producto>(`/productos/${id}`)
  return res.data
}

export const createProducto = async (data: ProductoFormData): Promise<Producto> => {
  const res = await api.post<Producto>("/productos/", data)
  return res.data
}

export const updateProducto = async ({
  id,
  data,
}: {
  id: number
  data: ProductoFormData
}): Promise<Producto> => {
  const res = await api.put<Producto>(`/productos/${id}`, data)
  return res.data
}

export const deleteProducto = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`)
}

