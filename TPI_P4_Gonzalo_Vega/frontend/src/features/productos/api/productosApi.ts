import { axiosInstance } from "../../../shared/api/axiosInstance";
import type {
  Producto,
  ProductoCreatePayload,
  ProductoQueryParams,
  ProductosPaginados,
  ProductoStockUpdatePayload,
  ProductoUpdatePayload,
} from "../types";

export const productosApi = {
  getAll: async (params?: ProductoQueryParams): Promise<ProductosPaginados> => {
    const res = await axiosInstance.get<ProductosPaginados>("/productos", {
      params,
    });
    return res.data;
  },

  getById: async (id: number): Promise<Producto> => {
    const res = await axiosInstance.get<Producto>(`/productos/${id}`);
    return res.data;
  },

  create: async (payload: ProductoCreatePayload): Promise<Producto> => {
    const res = await axiosInstance.post<Producto>("/productos", payload);
    return res.data;
  },

  update: async (
    id: number,
    payload: ProductoUpdatePayload
  ): Promise<Producto> => {
    const res = await axiosInstance.put<Producto>(`/productos/${id}`, payload);
    return res.data;
  },

  updateStock: async (
    id: number,
    payload: ProductoStockUpdatePayload
  ): Promise<Producto> => {
    const res = await axiosInstance.patch<Producto>(
      `/productos/${id}/stock`,
      payload
    );
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/productos/${id}`);
  },
};

