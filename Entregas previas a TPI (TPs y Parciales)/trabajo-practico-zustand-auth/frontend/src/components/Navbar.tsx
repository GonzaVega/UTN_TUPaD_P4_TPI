import { Link, NavLink, useNavigate } from "react-router-dom";
import utnLogo from "../assets/utn-logo.png";
import { useAuthStore } from "../store/authStore";
import { Button } from "./common/Button";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isAdmin = user?.roles.includes("admin");

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1.5 shadow-xs transition-transform group-hover:scale-105">
            <img
              src={utnLogo}
              alt="Logo Universidad Tecnológica Nacional"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Food Store
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Programación IV — TP9 Zustand & Auth
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
                    ? "bg-blue-50 text-blue-700 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
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
                    ? "bg-blue-50 text-blue-700 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
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
                    ? "bg-blue-50 text-blue-700 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
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
                      ? "bg-amber-50 text-amber-800 font-semibold shadow-xs"
                      : "text-amber-700 hover:text-amber-900 hover:bg-amber-50/70"
                  }`
                }
              >
                Usuarios
              </NavLink>
            )}
          </nav>
        )}

        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {user.nombre} {user.apellido}
                </p>
                <div className="flex justify-end gap-1 mt-0.5">
                  {user.roles.map((r) => (
                    <span
                      key={r}
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        r === "admin"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {r.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-xs px-3 py-1.5 border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline" className="text-xs px-3 py-1.5">
                  Ingresar
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" className="text-xs px-3 py-1.5">
                  Registro
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
