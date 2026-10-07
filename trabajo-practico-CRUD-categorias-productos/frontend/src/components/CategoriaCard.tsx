import type { Categoria } from "../types/categoria";

export interface CategoriaCardProps {
  categoria: Categoria;
  numero: number;
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
}

export function CategoriaCard({
  categoria,
  numero,
  onEdit,
  onDelete,
}: CategoriaCardProps) {
  return (
    <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-b-0">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500">
        {numero}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
        {categoria.nombre}
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 max-w-md break-words">
        {categoria.descripcion || (
          <span className="text-slate-400 italic">Sin descripción</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={() => onEdit(categoria)}
            className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 font-medium px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(categoria.id)}
            className="text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 font-medium px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
