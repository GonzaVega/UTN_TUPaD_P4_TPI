import type { Producto } from "../types/producto";
import { ProductoCard } from "./ProductoCard";

export interface ProductoListProps {
  productos: Producto[];
  onEdit: (producto: Producto) => void;
  onToggleDisponible: (producto: Producto) => void;
  onDelete: (id: number) => void;
}

export function ProductoList({
  productos,
  onEdit,
  onToggleDisponible,
  onDelete,
}: ProductoListProps) {
  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-12 text-center">
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          No hay productos registrados
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Comienza creando un nuevo producto haciendo clic en el botón Añadir
          Producto.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th
                scope="col"
                className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-16"
              >
                #
              </th>
              <th
                scope="col"
                className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                PRODUCTO
              </th>
              <th
                scope="col"
                className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                PRECIO / UNIDAD
              </th>
              <th
                scope="col"
                className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                STOCK
              </th>
              <th
                scope="col"
                className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                VENTA
              </th>
              <th
                scope="col"
                className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {productos.map((producto, index) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                numero={index + 1}
                onEdit={onEdit}
                onToggleDisponible={onToggleDisponible}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
