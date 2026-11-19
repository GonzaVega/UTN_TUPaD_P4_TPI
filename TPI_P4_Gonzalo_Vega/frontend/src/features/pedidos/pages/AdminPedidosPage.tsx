import React, { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { handleApiError } from "../../../shared/api/handleApiError";
import { EstadoError } from "../../../shared/components/EstadoError";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";
import { Paginacion } from "../../../shared/components/Paginacion";
import { TableSkeleton } from "../../../shared/components/Skeleton";
import { BadgeEstado } from "../../../shared/ui/BadgeEstado";
import { Button } from "../../../shared/ui/Button";
import { Modal } from "../../../shared/ui/Modal";
import { useCambiarEstadoPedido, usePedidos } from "../hooks/usePedidos";
import type { EstadoPedido, Pedido } from "../types";

const columnHelper = createColumnHelper<Pedido>();

export const AdminPedidosPage: React.FC = () => {
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
  } = usePedidos({
    limit: 100,
    estado: filtroEstado || undefined,
  });

  const pedidos = responseData?.items ?? [];
  const cambiarEstadoMutation = useCambiarEstadoPedido();
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

  const handleTransicion = async (pedidoId: number, nuevoEstado: EstadoPedido) => {
    const accionTexto =
      nuevoEstado === "EN_PREPARACION"
        ? "pasar a preparación"
        : nuevoEstado === "ENTREGADO"
        ? "marcar como entregado"
        : "cancelar";

    if (confirm(`¿Confirmas ${accionTexto} el pedido #${pedidoId}?`)) {
      try {
        await cambiarEstadoMutation.mutateAsync({
          id: pedidoId,
          payload: { estado: nuevoEstado },
        });
        if (pedidoSeleccionado?.id === pedidoId) {
          setPedidoSeleccionado(null);
        }
      } catch (err) {
        alert(handleApiError(err, "Error al cambiar el estado del pedido"));
      }
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "# ID",
        cell: (info) => (
          <span className="font-bold text-slate-400">#{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Fecha",
        cell: (info) => (
          <span className="text-xs text-slate-600">
            {new Date(info.getValue()).toLocaleString("es-AR", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ),
      }),
      columnHelper.accessor("total", {
        header: "Total",
        cell: (info) => (
          <span className="font-black text-slate-900">
            ${Number(info.getValue()).toFixed(2)}
          </span>
        ),
      }),
      columnHelper.accessor("estado", {
        header: "Estado",
        cell: (info) => <BadgeEstado estado={info.getValue()} />,
      }),
      columnHelper.accessor("direccion_entrega", {
        header: "Dirección",
        cell: (info) => (
          <span className="text-xs text-slate-600 max-w-xs truncate block" title={info.getValue()}>
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "acciones",
        header: () => <div className="text-right">Acciones de Máquina de Estados</div>,
        cell: (info) => {
          const p = info.row.original;

          return (
            <div className="flex items-center justify-end space-x-1.5">
              <button
                type="button"
                onClick={() => setPedidoSeleccionado(p)}
                className="text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold px-2 py-1 rounded text-xs transition-colors cursor-pointer"
              >
                Detalle
              </button>

              {p.estado === "PENDIENTE" && (
                <>
                  <button
                    type="button"
                    onClick={() => handleTransicion(p.id, "EN_PREPARACION")}
                    className="text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold px-2 py-1 rounded text-xs transition-colors cursor-pointer"
                  >
                    A Preparación →
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTransicion(p.id, "CANCELADO")}
                    className="text-rose-700 bg-rose-50 hover:bg-rose-100 font-semibold px-2 py-1 rounded text-xs transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </>
              )}

              {p.estado === "EN_PREPARACION" && (
                <>
                  <button
                    type="button"
                    onClick={() => handleTransicion(p.id, "ENTREGADO")}
                    className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold px-2 py-1 rounded text-xs transition-colors cursor-pointer"
                  >
                    Entregar ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTransicion(p.id, "CANCELADO")}
                    className="text-rose-700 bg-rose-50 hover:bg-rose-100 font-semibold px-2 py-1 rounded text-xs transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </>
              )}

              {(p.estado === "ENTREGADO" || p.estado === "CANCELADO") && (
                <span className="text-[11px] text-slate-400 italic">Estado final</span>
              )}
            </div>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: pedidos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Gestión de Pedidos
          </h1>
          <p className="text-sm text-slate-500">
            Supervisa órdenes y comanda las transiciones de la máquina de estados
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="EN_PREPARACION">EN_PREPARACION</option>
            <option value="ENTREGADO">ENTREGADO</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </div>
      </div>

      {isLoading && <TableSkeleton rows={6} cols={6} />}

      {isError && (
        <EstadoError
          mensaje={handleApiError(error, "No se pudieron cargar los pedidos")}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && pedidos.length === 0 && (
        <EstadoVacio
          titulo="No hay pedidos con el filtro actual"
          descripcion="No se encontraron pedidos registrados con los criterios seleccionados."
        />
      )}

      {!isLoading && !isError && pedidos.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider select-none"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Paginacion
            pageIndex={table.getState().pagination.pageIndex}
            pageSize={table.getState().pagination.pageSize}
            total={pedidos.length}
            onPageChange={(newPage) => table.setPageIndex(newPage)}
          />
        </div>
      )}

      <Modal
        isOpen={Boolean(pedidoSeleccionado)}
        onClose={() => setPedidoSeleccionado(null)}
        title={`Administración de Pedido #${pedidoSeleccionado?.id ?? ""}`}
      >
        {pedidoSeleccionado && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Estado actual:</span>
              <BadgeEstado estado={pedidoSeleccionado.estado} />
            </div>

            <div className="space-y-1 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p>
                <strong>Cliente (ID Usuario):</strong> #{pedidoSeleccionado.usuario_id}
              </p>
              <p>
                <strong>Dirección de Entrega:</strong> {pedidoSeleccionado.direccion_entrega}
              </p>
              <p>
                <strong>Forma de Pago:</strong> {pedidoSeleccionado.forma_pago}
              </p>
              {pedidoSeleccionado.notas && (
                <p>
                  <strong>Notas del Cliente:</strong> {pedidoSeleccionado.notas}
                </p>
              )}
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                Líneas del Pedido
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {pedidoSeleccionado.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 flex justify-between text-xs bg-white">
                    <div>
                      <p className="font-bold text-slate-900">{it.nombre_producto}</p>
                      <p className="text-[11px] text-slate-500">
                        {it.cantidad} u. × ${it.precio_unitario.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-black text-slate-900 my-auto">
                      ${it.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 font-black text-base text-slate-900">
              <span>Total Pedido:</span>
              <span className="text-amber-600">${pedidoSeleccionado.total.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap justify-end gap-2">
              {pedidoSeleccionado.estado === "PENDIENTE" && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleTransicion(pedidoSeleccionado.id, "EN_PREPARACION")}
                  >
                    Avanzar a En Preparación
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleTransicion(pedidoSeleccionado.id, "CANCELADO")}
                  >
                    Cancelar Pedido
                  </Button>
                </>
              )}

              {pedidoSeleccionado.estado === "EN_PREPARACION" && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleTransicion(pedidoSeleccionado.id, "ENTREGADO")}
                  >
                    Confirmar Entrega
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleTransicion(pedidoSeleccionado.id, "CANCELADO")}
                  >
                    Cancelar Pedido
                  </Button>
                </>
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

