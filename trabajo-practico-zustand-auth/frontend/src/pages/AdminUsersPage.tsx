import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../api/axiosInstance";
import type { UsuarioAuth } from "../types/auth.types";
import { Button } from "../components/common/Button";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";

export function AdminUsersPage() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, isError, error, refetch } = useQuery<UsuarioAuth[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axiosInstance.get<UsuarioAuth[]>("/admin/usuarios");
      return res.data;
    },
  });

  const activarMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.post(`/admin/usuarios/${id}/activar`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.detail || "Error al activar el usuario.");
    },
  });

  const desactivarMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.post(`/admin/usuarios/${id}/desactivar`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.detail || "Error al desactivar el usuario.");
    },
  });

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Administración de Usuarios</h2>
          <p className="text-sm text-slate-500 mt-1">Gestión de cuentas y estado de actividad (RBAC)</p>
        </div>
      </div>

      {isError && <ErrorState titulo="Error al cargar usuarios:" error={error} onRetry={() => refetch()} />}

      {isLoading ? (
        <LoadingState mensaje="Cargando usuarios..." />
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-xs border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Roles</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isDesactivado = u.deleted_at !== null;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{u.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {u.nombre} {u.apellido}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <span
                            key={r}
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              r === "admin"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {isDesactivado ? (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800">
                          Desactivado
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                          Activo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isDesactivado ? (
                        <Button
                          variant="outline"
                          onClick={() => activarMutation.mutate(u.id)}
                          className="text-xs px-2.5 py-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                        >
                          Activar
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => desactivarMutation.mutate(u.id)}
                          className="text-xs px-2.5 py-1 text-rose-700 border-rose-300 hover:bg-rose-50"
                        >
                          Desactivar
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

