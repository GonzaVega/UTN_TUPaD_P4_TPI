import { Link } from "react-router-dom"
import { Button } from "./Button"

export function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 space-y-4">
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          !
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Acceso Denegado</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No tienes los permisos requeridos para acceder a esta sección. Si crees que se trata de un error, contacta al administrador.
        </p>
        <div className="pt-2">
          <Link to="/categories">
            <Button variant="primary" className="text-sm px-4 py-2">
              Volver al Catálogo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

