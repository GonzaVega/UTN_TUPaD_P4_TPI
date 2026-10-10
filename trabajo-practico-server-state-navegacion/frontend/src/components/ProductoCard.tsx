import type { Producto } from "../types/producto";

export interface ProductoCardProps {
  producto: Producto;
}

export function ProductoCard({ producto }: ProductoCardProps) {
  return (
    <article className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Imagen del Producto */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
            <span className="text-4xl">🍽️</span>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-xs ${
              producto.disponible
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                : "bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            {producto.disponible ? "Disponible" : "Agotado"}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Categorías vinculadas (Relación N:N) */}
          {producto.categorias && producto.categorias.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {producto.categorias.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100"
                >
                  {cat.nombre}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
            {producto.nombre}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {producto.descripcion || (
              <span className="italic text-slate-400">Sin descripción disponible</span>
            )}
          </p>
        </div>

        {/* Precio */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Precio
          </span>
          <span className="text-lg font-extrabold text-slate-900">
            ${producto.precio_base.toFixed(2)}
          </span>
        </div>
      </div>
    </article>
  );
}
