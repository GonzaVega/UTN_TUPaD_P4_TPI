import React, { useMemo } from "react";
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
import { useAuthStore } from "../../../store/authStore";
import type { UserPublic } from "../../auth/types";
import {
  useActivarUsuario,
  useDesactivarUsuario,
  useUsuarios,
} from "../hooks/useUsuarios";

const columnHelper = createColumnHelper<UserPublic>();

export const AdminUsuariosPage: React.FC = () => {
  const currentSessionUser = useAuthStore((state) => state.usuario);
  const { data: usuarios = [], isLoading, isError, error, refetch } = useUsuarios();

  const activarMutation = useActivarUsuario();
  const desactivarMutation = useDesactivarUsuario();

  const handleActivar = async (id: number) => {
    try {
      await activarMutation.mutateAsync(id);
    } catch (err) {
      alert(handleApiError(err, "Error al activar usuario"));
    }
  };

  const handleDesactivar = async (id: number, username: string) => {
    if (confirm(`¿Desactivar la cuenta del usuario "${username}"?`)) {
      try {
        await desactivarMutation.mutateAsync(id);
      } catch (err) {
        alert(handleApiError(err, "Error al desactivar usuario"));
      }
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "# ID",
        cell: (info) => (
          <span className="font-semibold text-slate-400">#{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("username", {
        header: "Usuario",
        cell: (info) => {
          const u = info.row.original;
          const isMe = currentSessionUser?.id === u.id;
          return (
            <div>
              <span className="font-bold text-slate-900">{info.getValue()}</span>
              {isMe && (
                <span className="ml-2 bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                  TÚ
                </span>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("full_name", {
        header: "Nombre Completo",
        cell: (info) => (
          <span className="text-slate-700 font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => (
          <span className="text-slate-500 text-xs">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("role", {
        header: "Rol",
        cell: (info) => {
          const role = info.getValue();
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                role === "admin"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {role}
            </span>
          );
        },
      }),
      columnHelper.accessor("disabled", {
        header: "Estado",
        cell: (info) => {
          const disabled = info.getValue();
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                disabled
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {disabled ? "Desactivado" : "Activo"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "acciones",
        header: () => <div className="text-right">Acciones</div>,
        cell: (info) => {
          const u = info.row.original;
          const isCurrentSessionUser = currentSessionUser?.id === u.id;

          return (
            <div className="flex items-center justify-end space-x-2">
              {u.disabled ? (
                <button
                  type="button"
                  onClick={() => handleActivar(u.id)}
                  className="text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-semibold px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
                >
                  Activar
                </button>
              ) : (

                !isCurrentSessionUser && (
                  <button
                    type="button"
                    onClick={() => handleDesactivar(u.id, u.username)}
                    className="text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 font-semibold px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
                  >
                    Desactivar
                  </button>
                )
              )}
            </div>
          );
        },
      }),
    ],
    [currentSessionUser]
  );

  const table = useReactTable({
    data: usuarios,
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
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Gestión de Usuarios
        </h1>
        <p className="text-sm text-slate-500">
          Control de acceso, roles y estados de cuenta de clientes y administradores
        </p>
      </div>

      {isLoading && <TableSkeleton rows={5} cols={6} />}

      {isError && (
        <EstadoError
          mensaje={handleApiError(error, "No se pudieron cargar los usuarios")}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && usuarios.length === 0 && (
        <EstadoVacio
          titulo="No hay usuarios registrados"
          descripcion="Aún no se han registrado usuarios en el sistema."
        />
      )}

      {!isLoading && !isError && usuarios.length > 0 && (
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
            total={usuarios.length}
            onPageChange={(newPage) => table.setPageIndex(newPage)}
          />
        </div>
      )}
    </div>
  );
};

