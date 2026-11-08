import type { Categoria, CategoriaFormData } from "../types/categoria"
import { api } from "@/shared/api"

export const getCategorias = async (): Promise<Categoria[]> => {
  const res = await api.get<Categoria[]>("/categorias/")
  return res.data
}

export const getCategoriaById = async (id: number): Promise<Categoria> => {
  const res = await api.get<Categoria>(`/categorias/${id}`)
  return res.data
}

export const createCategoria = async (data: CategoriaFormData): Promise<Categoria> => {
  const res = await api.post<Categoria>("/categorias/", data)
  return res.data
}

export const updateCategoria = async ({
  id,
  data,
}: {
  id: number
  data: CategoriaFormData
}): Promise<Categoria> => {
  const res = await api.put<Categoria>(`/categorias/${id}`, data)
  return res.data
}

export const deleteCategoria = async (id: number): Promise<void> => {
  await api.delete(`/categorias/${id}`)
}

