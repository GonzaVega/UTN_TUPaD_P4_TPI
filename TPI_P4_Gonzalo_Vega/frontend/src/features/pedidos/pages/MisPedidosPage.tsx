import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../../../shared/api/handleApiError";
import { EstadoError } from "../../../shared/components/EstadoError";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";
import { TableSkeleton } from "../../../shared/components/Skeleton";
import { BadgeEstado } from "../../../shared/ui/BadgeEstado";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import { Modal } from "../../../shared/ui/Modal";
import { useCancelarPedido, usePedidos } from "../hooks/usePedidos";
import type { Pedido } from "../types";

export const MisPedidosPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: responseData, isLoading, isError, error, refetch } = usePedidos();
  const pedidos = responseData?.items ?? [];

  const cancelarMutation = useCancelarPedido();
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

  const handleCancelar = async (pedidoId: number) => {
    if (confirm("¿Estás seguro de que deseas cancelar este pedido?")) {
      try {
        await cancelarMutation.mutateAsync(pedidoId);
        // Si el modal está abierto para este pedido, actualizamos la vista
        if (pedidoSeleccionado?.id === pedidoId) {
          setPedidoSeleccionado(null);
        }
      } catch (err) {
        alert(handleApiError(err, "No se pudo cancelar el pedido"));
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Mis Pedidos
        </h1>
        <p className="text-xs text-slate-500">
          Historial y seguimiento del estado de tus órdenes gastronómicas
        </p>
      </div>

      {isLoading && <TableSkeleton rows={4} cols={5} />}

      {isError && (
        <EstadoError
          mensaje={handleApiError(error, "Error al cargar tus pedidos")}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && pedidos.length === 0 && (
        <EstadoVacio
          titulo="Aún no has realizado ningún pedido"
          descripcion="Visita nuestro catálogo y elige tus platos preferidos."
          icono="📦"
          textoAccion="Ver Menú"
          onAccion={() => navigate("/")}
        />
      )}

      {!isLoading && !isError && pedidos.length > 0 && (
        <div className="space-y-4">
          {pedidos.map((p) => {
            const fechaFormateada = new Date(p.created_at).toLocaleString("es-AR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Card
                key={p.id}
                padding="md"
                className="hover:border-amber-300 transition-colors border-slate-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-black text-slate-900 text-base">
                      Pedido #{p.id}
                    </span>
                    <BadgeEstado estado={p.estado} />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {fechaFormateada}
                  </span>
                </div>

                {/* Ítems del pedido */}
                <div className="py-3 space-y-1">
                  {p.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-700">
                      <span>
                        <strong className="text-slate-900">{item.cantidad}x</strong> {item.nombre_producto}
                      </span>
                      <span className="font-semibold text-slate-800">
                        ${item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pie de pedido */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      Entrega en: <strong className="text-slate-700">{p.direccion_entrega}</strong> ({p.forma_pago})
                    </span>
                    <span className="text-sm font-black text-amber-600 block">
                      Total: ${p.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setPedidoSeleccionado(p)}
                      className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Ver Detalle
                    </button>

                    {/* Botón cancelar visible únicamente en estado PENDIENTE (RN-04) */}
                    {p.estado === "PENDIENTE" && (
                      <button
                        type="button"
                        onClick={() => handleCancelar(p.id)}
                        className="text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Cancelar Pedido
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Detalle */}
      <Modal
        isOpen={Boolean(pedidoSeleccionado)}
        onClose={() => setPedidoSeleccionado(null)}
        title={`Detalle del Pedido #${pedidoSeleccionado?.id ?? ""}`}
      >
        {pedidoSeleccionado && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Estado:</span>
              <BadgeEstado estado={pedidoSeleccionado.estado} />
            </div>

            <div className="space-y-1 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p>
                <strong>Dirección de entrega:</strong> {pedidoSeleccionado.direccion_entrega}
              </p>
              <p>
                <strong>Forma de pago:</strong> {pedidoSeleccionado.forma_pago}
              </p>
              {pedidoSeleccionado.notas && (
                <p>
                  <strong>Notas:</strong> {pedidoSeleccionado.notas}
                </p>
              )}
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                Platos incluidos
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {pedidoSeleccionado.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex justify-between text-xs bg-white">
                    <div>
                      <p className="font-bold text-slate-900">{item.nombre_producto}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.cantidad} u. × ${item.precio_unitario.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-black text-slate-900 my-auto">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 font-black text-base text-slate-900">
              <span>Total del Pedido:</span>
              <span className="text-amber-600">${pedidoSeleccionado.total.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
              {pedidoSeleccionado.estado === "PENDIENTE" && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleCancelar(pedidoSeleccionado.id)}
                >
                  Cancelar Pedido
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPedidoSeleccionado(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
