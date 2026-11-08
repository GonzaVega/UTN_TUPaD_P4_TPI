import { useState, useMemo } from "react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table"
import type { Ingrediente } from "../types/ingrediente"
import { useAuthStore } from "@/features/auth"
import { Pagination } from "@/shared/components/Pagination"

export interface IngredienteTableProps {
  data: Ingrediente[]
  onEdit: (ingrediente: Ingrediente) => void
  onDelete: (id: number) => void
}

const columnHelper = createColumnHelper<Ingrediente>()

export function IngredienteTable({
  data,
  onEdit,
  onDelete,
}: IngredienteTableProps) {
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.roles.includes("admin")

  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns = useMemo(() => {
    const baseCols = [
      columnHelper.display({
        id: "numero",
        header: "#",
        cell: (info) => (
          <span className="font-medium text-slate-400 dark:text-slate-500">
            {info.row.index + 1 + pagination.pageIndex * pagination.pageSize}
          </span>
        ),
      }),
      columnHelper.accessor("nombre", {
        header: "Nombre del Ingrediente",
        cell: (info) => (
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor((row) => row.activo !== false, {
        id: "activo",
        header: "Estado",
        cell: (info) => {
          const activo = info.getValue()
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                activo
                  ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
              }`}
            >
              {activo ? "Activo" : "Inactivo"}
            </span>
          )
        },
      }),
    ]

    if (isAdmin) {
      baseCols.push(
        columnHelper.display({
          id: "acciones",
          header: () => <div className="text-right">Acciones</div>,
          cell: (info) => {
            const ingrediente = info.row.original
            return (
              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => onEdit(ingrediente)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 font-medium px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(ingrediente.id)}
                  className="text-rose-600 dark:text-rose-400 hover:text-rose-800 bg-rose-50 dark:bg-rose-900/40 hover:bg-rose-100 font-medium px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            )
          },
        })
      )
    }

    return baseCols
  }, [onEdit, onDelete, pagination.pageIndex, pagination.pageSize, isAdmin])

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
  })

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sortDirection = header.column.getIsSorted()
                  const isAcciones = header.id === "acciones"
                  const isNumero = header.id === "numero"
                  const isActivo = header.id === "activo"

                  return (
                    <th
                      key={header.id}
                      scope="col"
                      onClick={header.column.getToggleSortingHandler()}
                      className={`px-6 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none ${
                        isAcciones
                          ? "w-44 text-right"
                          : isNumero
                          ? "w-16 text-center"
                          : isActivo
                          ? "w-36 text-center"
                          : "text-left"
                      } ${canSort ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" : ""}`}
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
                          <span className="text-slate-400 text-xs">
                            {sortDirection === "asc"
                              ? "▲"
                              : sortDirection === "desc"
                              ? "▼"
                              : "⇅"}
                          </span>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  No hay ingredientes registrados.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => {
                    const isAcciones = cell.column.id === "acciones"
                    const isNumero = cell.column.id === "numero"
                    const isActivo = cell.column.id === "activo"

                    return (
                      <td
                        key={cell.id}
                        className={`px-6 py-4 text-sm ${
                          isAcciones
                            ? "text-right"
                            : isNumero || isActivo
                            ? "text-center text-slate-400"
                            : "text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination table={table} />
    </div>
  )
}

