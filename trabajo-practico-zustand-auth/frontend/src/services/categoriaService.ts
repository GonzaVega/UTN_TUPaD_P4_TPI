import type { Categoria, CategoriaFormData } from "../types/categoria";
import { axiosInstance } from "../api/axiosInstance";

export const getCategorias = async (): Promise<Categoria[]> => {
  const res = await axiosInstance.get<Categoria[]>("/categorias/");
  return res.data;
};

export const getCategoriaById = async (id: number): Promise<Categoria> => {
  const res = await axiosInstance.get<Categoria>(`/categorias/${id}`);
  return res.data;
};

export const createCategoria = async (data: CategoriaFormData): Promise<Categoria> => {
  const res = await axiosInstance.post<Categoria>("/categorias/", data);
  return res.data;
};

export const updateCategoria = async ({
  id,
  data,
}: {
  id: number;
  data: CategoriaFormData;
}): Promise<Categoria> => {
  const res = await axiosInstance.put<Categoria>(`/categorias/${id}`, data);
  return res.data;
};

export const deleteCategoria = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categorias/${id}`);
};
