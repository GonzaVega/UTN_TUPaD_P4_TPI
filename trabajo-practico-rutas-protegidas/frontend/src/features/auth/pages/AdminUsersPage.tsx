import { useAdminUsers } from "../hooks/useAuth"
import { Button } from "@/shared/components/Button"
import { LoadingState } from "@/shared/components/LoadingState"
import { ErrorState } from "@/shared/components/ErrorState"

export function AdminUsersPage() {
  const {
    users,
    isLoading,
    isError,
    error,
    refetch,
    activateUser,
    deactivateUser,
    isActivating,
    isDeactivating,
  } = useAdminUsers()

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Administración de Usuarios</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gestión de cuentas y estado de actividad (RBAC)</p>
        </div>
      </div>

      {isError && <ErrorState titulo="Error al cargar usuarios:" error={error} onRetry={() => refetch()} />}

      {isLoading ? (
        <LoadingState mensaje="Cargando usuarios..." />
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Roles</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {users.map((u) => {
                const isDesactivado = Boolean(u.deleted_at)
                return (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">{u.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {u.nombre} {u.apellido}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <span
                            key={r}
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              r === "admin"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {isDesactivado ? (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
                          Desactivado
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                          Activo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isDesactivado ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={isActivating}
                          onClick={() => activateUser(u.id)}
                          className="text-xs"
                        >
                          Activar
                        </Button>
                      ) : (
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={isDeactivating}
                          onClick={() => deactivateUser(u.id)}
                          className="text-xs"
                        >
                          Desactivar
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
