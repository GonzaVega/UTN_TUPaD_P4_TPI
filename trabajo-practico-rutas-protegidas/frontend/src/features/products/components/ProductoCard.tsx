import type { Producto } from "../types/producto"

export interface ProductoCardProps {
  producto: Producto
}

export function ProductoCard({ producto }: ProductoCardProps) {
  return (
    <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400">
            <span className="text-4xl">🍽️</span>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-xs ${
              producto.disponible
                ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
            }`}
          >
            {producto.disponible ? "Disponible" : "Agotado"}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {producto.categorias && producto.categorias.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {producto.categorias.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center text-xs font-medium bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800"
                >
                  {cat.nombre}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {producto.nombre}
          </h3>

          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
            {producto.descripcion || (
              <span className="text-slate-400 dark:text-slate-500 italic">Sin descripción</span>
            )}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 block">Precio</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              ${producto.precio_base.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

