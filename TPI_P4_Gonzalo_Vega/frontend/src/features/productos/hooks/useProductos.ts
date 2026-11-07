import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productosApi } from "../api/productosApi";
import type {
  ProductoCreatePayload,
  ProductoQueryParams,
  ProductoStockUpdatePayload,
  ProductoUpdatePayload,
} from "../types";

export function useProductos(params?: ProductoQueryParams) {
  return useQuery({
    queryKey: ["productos", params],
    queryFn: () => productosApi.getAll(params),
  });
}

export function useProducto(id: number) {
  return useQuery({
    queryKey: ["productos", "detail", id],
    queryFn: () => productosApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductoCreatePayload) => productosApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

export function useUpdateProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: ProductoUpdatePayload;
    }) => productosApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

export function useUpdateStockProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: ProductoStockUpdatePayload;
    }) => productosApi.updateStock(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

export function useDeleteProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

