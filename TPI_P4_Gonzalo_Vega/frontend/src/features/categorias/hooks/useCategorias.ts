import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriasApi } from "../api/categoriasApi";
import type { CategoriaCreatePayload, CategoriaUpdatePayload } from "../types";

export const CATEGORIAS_QUERY_KEY = ["categorias"];

export function useCategorias() {
  return useQuery({
    queryKey: CATEGORIAS_QUERY_KEY,
    queryFn: () => categoriasApi.getAll(),
  });
}

export function useCreateCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoriaCreatePayload) =>
      categoriasApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

export function useUpdateCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: CategoriaUpdatePayload;
    }) => categoriasApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

export function useDeleteCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

