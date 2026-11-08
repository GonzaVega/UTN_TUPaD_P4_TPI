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
import type { Categoria } from "../types/categoria";
import { useAuthStore } from "../store/authStore";
import { Pagination } from "./common/Pagination";

export interface CategoriaTableProps {
  data: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
}

const columnHelper = createColumnHelper<Categoria>();

export function CategoriaTable({ data, onEdit, onDelete }: CategoriaTableProps) {
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
        header: "Nombre",
        cell: (info) => (
          <span className="font-semibold text-slate-900">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("descripcion", {
        header: "Descripción",
        cell: (info) => {
          const desc = info.getValue();
          return desc ? (
            <span className="text-slate-600 line-clamp-2">{desc}</span>
          ) : (
            <span className="text-slate-400 italic">Sin descripción</span>
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
            const categoria = info.row.original;
            return (
              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => onEdit(categoria)}
                  className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 font-medium px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(categoria.id)}
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
                  const isNombre = header.id === "nombre";

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
                          : isNombre
                          ? "w-56 text-left"
                          : "text-left"
                      } ${canSort ? "cursor-pointer hover:bg-slate-100" : ""}`}
                    >
                      <div
                        className={`flex items-center space-x-1.5 ${
                          isAcciones
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
                  const isNombre = cell.column.id === "nombre";

                  return (
                    <td
                      key={cell.id}
                      className={`px-6 py-4 text-sm text-slate-700 ${
                        isAcciones
                          ? "w-44 text-right whitespace-nowrap"
                          : isNumero
                          ? "w-16 text-center whitespace-nowrap"
                          : isNombre
                          ? "w-56 whitespace-nowrap"
                          : "whitespace-normal break-words"
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
