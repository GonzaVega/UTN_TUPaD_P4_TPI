import type { Categoria } from "../types/categoria";
import { CategoriaCard } from "./CategoriaCard";

export interface CategoriaListProps {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
}

export function CategoriaList({
  categorias,
  onEdit,
  onDelete,
}: CategoriaListProps) {
  if (categorias.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-12 text-center">
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          No hay categorías registradas
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Comienza creando una nueva categoría haciendo clic en el botón Añadir
          Categoría.
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
                className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-24"
              >
                NÚMERO
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-48"
              >
                NOMBRE
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                DESCRIPCIÓN
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider w-36"
              >
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {categorias.map((categoria, index) => (
              <CategoriaCard
                key={categoria.id}
                categoria={categoria}
                numero={index + 1}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
