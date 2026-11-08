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
import type { Ingrediente } from "../types/ingrediente";
import { useAuthStore } from "../store/authStore";
import { Pagination } from "./common/Pagination";

export interface IngredienteTableProps {
  data: Ingrediente[];
  onEdit: (ingrediente: Ingrediente) => void;
  onDelete: (id: number) => void;
}

const columnHelper = createColumnHelper<Ingrediente>();

export function IngredienteTable({
  data,
  onEdit,
  onDelete,
}: IngredienteTableProps) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roles.includes("admin");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(() => {
    const baseCols = [
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
        header: "Nombre del Ingrediente",
        cell: (info) => (
          <span className="font-semibold text-slate-900">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor((row) => row.activo !== false, {
        id: "activo",
        header: "Estado",
        cell: (info) => {
          const activo = info.getValue();
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                activo
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {activo ? "Activo" : "Inactivo"}
            </span>
          );
        },
      }),
    ];

    if (isAdmin) {
      baseCols.push(
        columnHelper.display({
          id: "acciones",
          header: () => <div className="text-right">Acciones</div>,
          cell: (info) => {
            const ingrediente = info.row.original;
            return (
              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => onEdit(ingrediente)}
                  className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 font-medium px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(ingrediente.id)}
                  className="text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 font-medium px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            );
          },
        })
      );
    }

    return baseCols;
  }, [onEdit, onDelete, pagination.pageIndex, pagination.pageSize, isAdmin]);

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
        <table className="w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();
                  const isAcciones = header.id === "acciones";
                  const isNumero = header.id === "numero";
                  const isActivo = header.id === "activo";

                  return (
                    <th
                      key={header.id}
                      scope="col"
                      onClick={header.column.getToggleSortingHandler()}
                      className={`px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider select-none ${
                        isAcciones
                          ? "w-44 text-right"
                          : isNumero
                          ? "w-16 text-center"
                          : isActivo
                          ? "w-36 text-center"
                          : "text-left"
                      } ${canSort ? "cursor-pointer hover:bg-slate-100" : ""}`}
                    >
                      <div
                        className={`flex items-center space-x-1.5 ${
                          isAcciones
                            ? "justify-end"
                            : isNumero || isActivo
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
                  const isActivo = cell.column.id === "activo";

                  return (
                    <td
                      key={cell.id}
                      className={`px-6 py-4 text-sm text-slate-700 ${
                        isAcciones
                          ? "w-44 text-right whitespace-nowrap"
                          : isNumero
                          ? "w-16 text-center whitespace-nowrap"
                          : isActivo
                          ? "w-36 text-center whitespace-nowrap"
                          : "text-left whitespace-nowrap"
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
