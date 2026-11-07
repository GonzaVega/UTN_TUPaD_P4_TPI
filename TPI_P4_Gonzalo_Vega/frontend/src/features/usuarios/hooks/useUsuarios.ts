import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usuariosApi } from "../api/usuariosApi";

export const USUARIOS_QUERY_KEY = ["usuarios"];

export function useUsuarios() {
  return useQuery({
    queryKey: USUARIOS_QUERY_KEY,
    queryFn: () => usuariosApi.getAll(),
  });
}

export function useActivarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usuariosApi.activar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USUARIOS_QUERY_KEY });
    },
  });
}

export function useDesactivarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usuariosApi.desactivar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USUARIOS_QUERY_KEY });
    },
  });
}

