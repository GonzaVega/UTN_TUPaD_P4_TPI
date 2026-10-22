import { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import type { Producto } from "../types/producto";
import { Pagination } from "./common/Pagination";

export interface ProductoTableProps {
  data: Producto[];
  onViewCard: (producto: Producto) => void;
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
}

const columnHelper = createColumnHelper<Producto>();

export function ProductoTable({
  data,
  onViewCard,
  onEdit,
  onDelete,
}: ProductoTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "numero",
        header: "#",
        cell: (info) => (
          <span className="font-medium text-slate-400">
            {info.row.index + 1 + pagination.pageIndex * pagination.pageSize}
          </span>
        ),
      }),
      columnHelper.accessor("nombre", {
        header: "Producto",
        cell: (info) => {
          const prod = info.row.original;
          return (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 flex items-center justify-center">
                {prod.imagen_url ? (
                  <img
                    src={prod.imagen_url}
                    alt={prod.nombre}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-base">🍽️</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => onViewCard(prod)}
                className="text-left font-semibold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                title="Hacer clic para ver tarjeta completa"
              >
                {info.getValue()}
              </button>
            </div>
          );
        },
      }),
      columnHelper.accessor("precio_base", {
        header: "Precio Base",
        cell: (info) => (
          <span className="font-bold text-slate-900">
            ${Number(info.getValue()).toFixed(2)}
          </span>
        ),
      }),
      columnHelper.accessor("disponible", {
        header: "Estado",
        cell: (info) => {
          const disponible = info.getValue();
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${disponible
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
            >
              {disponible ? "Disponible" : "Agotado"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "categorias",
        header: "Categorías",
        cell: (info) => {
          const categorias = info.row.original.categorias;
          if (!categorias || categorias.length === 0) {
            return (
              <span className="text-slate-400 text-xs italic">
                Sin categoría
              </span>
            );
          }
          return (
            <div className="flex flex-wrap gap-1">
              {categorias.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100"
                >
                  {cat.nombre}
                </span>
              ))}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "acciones",
        header: () => <div className="text-right">Acciones</div>,
        cell: (info) => {
          const prod = info.row.original;
          return (
            <div className="flex items-center justify-end space-x-1.5">
              <button
                type="button"
                onClick={() => onEdit(prod)}
                className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 font-medium px-2 py-1 rounded text-xs transition-colors cursor-pointer"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete(prod.id)}
                className="text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 font-medium px-2 py-1 rounded text-xs transition-colors cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          );
        },
      }),
    ],
    [onEdit, onDelete, pagination.pageIndex, pagination.pageSize]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();
                  const isAcciones = header.id === "acciones";
                  const isNumero = header.id === "numero";

                  return (
                    <th
                      key={header.id}
                      scope="col"
                      onClick={header.column.getToggleSortingHandler()}
                      className={`px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider select-none ${isAcciones
                        ? "w-44 text-right"
                        : isNumero
                          ? "w-16 text-center"
                          : "text-left"
                        } ${canSort ? "cursor-pointer hover:bg-slate-100" : ""}`}
                    >
                      <div
                        className={`flex items-center space-x-1.5 ${isAcciones
                          ? "justify-end"
                          : isNumero
                            ? "justify-center"
                            : ""
                          }`}
                      >
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {canSort && (
                          <span className="text-slate-400 text-xs font-normal">
                            {sortDirection === "asc"
                              ? "▲"
                              : sortDirection === "desc"
                                ? "▼"
                                : "⇅"}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="bg-white divide-y divide-slate-100">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                {row.getVisibleCells().map((cell) => {
                  const isAcciones = cell.column.id === "acciones";
                  const isNumero = cell.column.id === "numero";

                  return (
                    <td
                      key={cell.id}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-slate-700 ${isAcciones
                        ? "w-44 text-right"
                        : isNumero
                          ? "w-16 text-center"
                          : "text-left"
                        }`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination table={table} />
    </div>
  );
}
