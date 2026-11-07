import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pedidosApi } from "../api/pedidosApi";
import type {
  CambioEstadoPayload,
  PedidoCreatePayload,
  PedidoQueryParams,
} from "../types";

export const PEDIDOS_QUERY_KEY = ["pedidos"];

export function usePedidos(params?: PedidoQueryParams) {
  return useQuery({
    queryKey: ["pedidos", params],
    queryFn: () => pedidosApi.getAll(params),
  });
}

export function usePedido(id: number) {
  return useQuery({
    queryKey: ["pedidos", "detail", id],
    queryFn: () => pedidosApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useResumenPedidos() {
  return useQuery({
    queryKey: ["pedidos", "resumen"],
    queryFn: () => pedidosApi.getResumen(),
    refetchInterval: 1000 * 20, // refresco suave cada 20 segundos
  });
}

export function useCrearPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PedidoCreatePayload) => pedidosApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

export function useCambiarEstadoPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: CambioEstadoPayload;
    }) => pedidosApi.cambiarEstado(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

export function useCancelarPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pedidosApi.cancelarCliente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

