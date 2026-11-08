import { Link } from "react-router-dom"
import { LoginForm } from "../components/LoginForm"

export function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Iniciar Sesión</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ingresa tus credenciales para acceder al sistema</p>
        </div>

        <LoginForm />

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 text-center text-xs text-slate-600 dark:text-slate-400">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  )
}
