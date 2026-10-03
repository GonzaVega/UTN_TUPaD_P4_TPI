import type { Producto } from "../types/producto";
import { ProductoCard } from "./ProductoCard";

interface ProductoListProps {
  productos: Producto[];
}

export const ProductoList = ({ productos }: ProductoListProps) => {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-xl mx-auto mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl" role="img" aria-label="lista">
          📋
        </span>
        <h2 className="text-lg font-bold text-gray-800">
          Productos ({productos.length})
        </h2>
      </div>

      <div className="w-full">
        {/* Cabecera de columnas tal como en la captura del apunte */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <span className="w-6 text-center">ID</span>
            <span>NOMBRE</span>
          </div>
          <div className="flex items-center gap-8">
            <span>PRECIO</span>
            <span className="w-28 text-right">CATEGORÍA</span>
          </div>
        </div>

        {/* Mapeo de productos utilizando el método .map() con key obligatoria */}
        <div className="divide-y divide-gray-100">
          {productos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>

        {productos.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-6">
            No hay productos registrados en el catálogo.
          </p>
        )}
      </div>
    </section>
  );
};
