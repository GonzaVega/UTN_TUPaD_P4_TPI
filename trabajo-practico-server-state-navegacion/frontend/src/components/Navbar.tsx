import { NavLink, Link } from "react-router-dom";
import utnLogo from "../assets/utn-logo.png";

export function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Marca y Logo */}
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
              Gestor de Catálogo
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Programación IV — TP7 Server State & Rutas
            </p>
          </div>
        </Link>

        {/* Enlaces de Navegación con React Router */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <NavLink
            to="/categorias"
            className={({ isActive }) =>
              `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`
            }
          >
            Categorías
          </NavLink>

          <NavLink
            to="/productos"
            className={({ isActive }) =>
              `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`
            }
          >
            Productos
          </NavLink>
        </nav>

        {/* Enlace Externo Swagger */}
        <div className="hidden sm:flex items-center space-x-3 text-sm">
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-blue-600 font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50/50 transition-colors"
          >
            Swagger API Docs ↗
          </a>
        </div>
      </div>
    </header>
  );
}
