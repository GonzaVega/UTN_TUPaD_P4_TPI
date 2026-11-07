import { axiosInstance } from "../../../shared/api/axiosInstance";
import type {
  Categoria,
  CategoriaCreatePayload,
  CategoriaUpdatePayload,
} from "../types";

export const categoriasApi = {
  getAll: async (): Promise<Categoria[]> => {
    const res = await axiosInstance.get<Categoria[]>("/categorias");
    return res.data;
  },

  getById: async (id: number): Promise<Categoria> => {
    const res = await axiosInstance.get<Categoria>(`/categorias/${id}`);
    return res.data;
  },

  create: async (payload: CategoriaCreatePayload): Promise<Categoria> => {
    const res = await axiosInstance.post<Categoria>("/categorias", payload);
    return res.data;
  },

  update: async (
    id: number,
    payload: CategoriaUpdatePayload
  ): Promise<Categoria> => {
    const res = await axiosInstance.put<Categoria>(`/categorias/${id}`, payload);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/categorias/${id}`);
  },
};

