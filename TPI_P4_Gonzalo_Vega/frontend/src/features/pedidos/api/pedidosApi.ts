import { axiosInstance } from "../../../shared/api/axiosInstance";
import type {
  CambioEstadoPayload,
  Pedido,
  PedidoCreatePayload,
  PedidoQueryParams,
  PedidosPaginados,
  ResumenPedidos,
} from "../types";

export const pedidosApi = {
  create: async (payload: PedidoCreatePayload): Promise<Pedido> => {
    const res = await axiosInstance.post<Pedido>("/pedidos", payload);
    return res.data;
  },

  getAll: async (params?: PedidoQueryParams): Promise<PedidosPaginados> => {
    const res = await axiosInstance.get<PedidosPaginados>("/pedidos", {
      params,
    });
    return res.data;
  },

  getById: async (id: number): Promise<Pedido> => {
    const res = await axiosInstance.get<Pedido>(`/pedidos/${id}`);
    return res.data;
  },

  getResumen: async (): Promise<ResumenPedidos> => {
    const res = await axiosInstance.get<ResumenPedidos>("/pedidos/resumen");
    return res.data;
  },

  cambiarEstado: async (
    id: number,
    payload: CambioEstadoPayload
  ): Promise<Pedido> => {
    const res = await axiosInstance.patch<Pedido>(
      `/pedidos/${id}/estado`,
      payload
    );
    return res.data;
  },

  cancelarCliente: async (id: number): Promise<Pedido> => {
    const res = await axiosInstance.patch<Pedido>(`/pedidos/${id}/cancelar`);
    return res.data;
  },
};

