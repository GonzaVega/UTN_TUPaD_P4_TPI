import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();
  const totalCantidad = useCartStore((state) => state.totalCantidad());

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
      isActive
        ? "bg-amber-100 text-amber-900 font-semibold"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  const adminLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs font-semibold uppercase tracking-wider transition-colors px-2.5 py-1 rounded-md ${
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 text-slate-900 font-black text-xl tracking-tight">
              <span className="text-2xl">🍕</span>
              <span>Food Store</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <NavLink to="/" end className={navLinkClass}>
                Catálogo
              </NavLink>

              {usuario && (
                <NavLink to="/mis-pedidos" className={navLinkClass}>
                  Mis Pedidos
                </NavLink>
              )}
            </nav>
          </div>

          {usuario?.role === "admin" && (
            <div className="hidden lg:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded mr-1">
                PANEL
              </span>
              <NavLink to="/admin/resumen" className={adminLinkClass}>
                Resumen
              </NavLink>
              <NavLink to="/admin/categorias" className={adminLinkClass}>
                Categorías
              </NavLink>
              <NavLink to="/admin/productos" className={adminLinkClass}>
                Productos
              </NavLink>
              <NavLink to="/admin/pedidos" className={adminLinkClass}>
                Pedidos
              </NavLink>
              <NavLink to="/admin/usuarios" className={adminLinkClass}>
                Usuarios
              </NavLink>
            </div>
          )}

          <div className="flex items-center space-x-3">

            <Link
              to="/carrito"
              className="relative p-2 text-slate-700 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Ver Carrito de Compras"
            >
              <span className="text-xl">🛒</span>
              {totalCantidad > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalCantidad}
                </span>
              )}
            </Link>

            {usuario ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {usuario.full_name}
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center justify-end space-x-1">
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${
                        usuario.role === "admin" ? "bg-purple-600" : "bg-emerald-500"
                      }`}
                    />
                    <span className="capitalize">{usuario.role}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

