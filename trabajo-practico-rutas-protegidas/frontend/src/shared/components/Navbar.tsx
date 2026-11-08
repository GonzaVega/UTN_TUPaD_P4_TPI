import { Link, NavLink, useNavigate } from "react-router-dom"
import utnLogo from "@/assets/utn-logo.png"
import { useAuthStore } from "@/features/auth"
import { useThemeStore } from "@/store/themeStore"
import { Button } from "./Button"

export function Navbar() {
  const { user, logout } = useAuthStore()
  const { darkMode, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const isAdmin = user?.roles.includes("admin")

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1.5 shadow-xs transition-transform group-hover:scale-105">
            <img
              src={utnLogo}
              alt="Logo Universidad Tecnológica Nacional"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Food Store
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Programación IV — TP10 Arquitectura & Rutas Protegidas
            </p>
          </div>
        </Link>

        {user && (
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                }`
              }
            >
              Categorías
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                }`
              }
            >
              Productos
            </NavLink>

            <NavLink
              to="/ingredients"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                }`
              }
            >
              Ingredientes
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-semibold shadow-xs"
                      : "text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 hover:bg-amber-50/70 dark:hover:bg-amber-900/20"
                  }`
                }
              >
                Usuarios
              </NavLink>
            )}
          </nav>
        )}

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            aria-label="Alternar modo oscuro"
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {user ? (
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {user.nombre} {user.apellido}
                </p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  {user.roles.map((r) => (
                    <span
                      key={r}
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        r === "admin"
                          ? "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300"
                          : "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300"
                      }`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="text-xs"
              >
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <NavLink to="/login">
                <Button variant="secondary" size="sm" className="text-xs">
                  Ingresar
                </Button>
              </NavLink>
              <NavLink to="/register">
                <Button variant="primary" size="sm" className="text-xs">
                  Registro
                </Button>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

