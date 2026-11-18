import type { Producto } from "../types/producto";

export interface ProductoCardProps {
  producto: Producto;
  numero: number;
  onEdit: (producto: Producto) => void;
  onToggleDisponible: (producto: Producto) => void;
  onDelete: (id: number) => void;
}

export function ProductoCard({
  producto,
  numero,
  onEdit,
  onToggleDisponible,
  onDelete,
}: ProductoCardProps) {
  const unidadSimbolo = producto.unidad_venta?.simbolo || "";

  const precioFormateado = `$ ${producto.precio_base.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} / ${unidadSimbolo}`;

  const stockFormateado = `stock: ${producto.stock_cantidad.toLocaleString("es-AR", {
    maximumFractionDigits: 3,
  })} ${unidadSimbolo}`;

  return (
    <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-b-0">
      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-slate-500">
        {numero}
      </td>

      <td className="px-5 py-4 text-sm max-w-xs">
        <div className="font-semibold text-slate-900">{producto.nombre}</div>
        <div className="text-xs text-slate-500 mt-0.5 break-words">
          {producto.descripcion || (
            <span className="text-slate-400 italic">Sin descripción</span>
          )}
        </div>
        {producto.categorias && producto.categorias.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {producto.categorias.map((cat) => (
              <span
                key={cat.id}
                className={`inline-flex items-center text-xs px-2 py-0.5 rounded border ${cat.es_principal
                    ? "bg-blue-50 text-blue-700 border-blue-200 font-semibold"
                    : "bg-slate-100 text-slate-600 border-slate-200 font-medium"
                  }`}
              >
                {cat.es_principal && "★ "}
                {cat.nombre}
              </span>
            ))}
          </div>
        )}
      </td>

      <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-slate-900 tabular-nums">
        {precioFormateado}
      </td>

      <td className="px-5 py-4 whitespace-nowrap text-sm">
        <div className="font-semibold text-slate-800 tabular-nums">
          {stockFormateado}
        </div>
        <span
          className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${producto.hay_stock
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
        >
          {producto.hay_stock ? "En stock" : "Sin stock"}
        </span>
      </td>

      <td className="px-5 py-4 whitespace-nowrap text-sm">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${producto.disponible
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
        >
          {producto.disponible ? "Disponible" : "Venta pausada"}
        </span>
      </td>

      <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={() => onEdit(producto)}
            className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 font-medium px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => onToggleDisponible(producto)}
            className={`font-medium px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${producto.disponible
                ? "text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100"
                : "text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100"
              }`}
          >
            Disponibilidad
          </button>

          <button
            type="button"
            onClick={() => onDelete(producto.id)}
            className="text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 font-medium px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer"
          >
            Anular
          </button>
        </div>
      </td>
    </tr>
  );
}
