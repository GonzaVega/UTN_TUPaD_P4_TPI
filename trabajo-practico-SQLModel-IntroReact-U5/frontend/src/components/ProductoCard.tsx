import type { Producto } from "../types/producto";

interface ProductoCardProps {
  producto: Producto;
}

export const ProductoCard = ({ producto }: ProductoCardProps) => {
  return (
    <div className="flex items-center justify-between py-3.5 px-4 hover:bg-gray-50/70 transition-colors">
      <div className="flex items-center gap-4 min-w-0">
        <span className="text-sm font-medium text-gray-500 w-6 text-center shrink-0">
          {producto.id}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {producto.nombre}
          </p>
          {producto.descripcion && (
            <p className="text-xs text-gray-400 truncate max-w-xs">
              {producto.descripcion}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-8 shrink-0">
        <span className="text-sm font-semibold text-gray-800 tabular-nums">
          ${producto.precio.toFixed(2)}
        </span>
        <span className="text-sm text-gray-500 w-28 text-right font-normal">
          {producto.categoria || "-"}
        </span>
      </div>
    </div>
  );
};
