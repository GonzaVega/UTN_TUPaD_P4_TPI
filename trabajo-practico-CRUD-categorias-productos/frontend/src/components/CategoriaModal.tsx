import { useState, useEffect } from "react";
import type { Categoria, CategoriaFormData } from "../types/categoria";

export interface CategoriaModalProps {
  isOpen: boolean;
  categoriaParaEditar: Categoria | null;
  onClose: () => void;
  onSubmit: (data: CategoriaFormData) => Promise<void>;
}

export function CategoriaModal({
  isOpen,
  categoriaParaEditar,
  onClose,
  onSubmit,
}: CategoriaModalProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (categoriaParaEditar) {
      setNombre(categoriaParaEditar.nombre);
      setDescripcion(categoriaParaEditar.descripcion || "");
    } else {
      setNombre("");
      setDescripcion("");
    }
    setErrorValidacion(null);
  }, [categoriaParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) {
      setErrorValidacion("El nombre de la categoría es obligatorio.");
      return;
    }

    try {
      setEnviando(true);
      setErrorValidacion(null);
      await onSubmit({
        nombre: nombreLimpio,
        descripcion: descripcion.trim(),
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorValidacion(err.message);
      } else {
        setErrorValidacion("Ocurrió un error al guardar la categoría.");
      }
    } finally {
      setEnviando(false);
    }
  };

  const esEdicion = Boolean(categoriaParaEditar);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {esEdicion ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {errorValidacion && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {errorValidacion}
            </div>
          )}

          <div>
            <label
              htmlFor="nombre"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
            >
              Nombre de la categoría *
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Pizzas, Hamburguesas, Bebidas..."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="descripcion"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción breve de los productos que abarca..."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={enviando}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {enviando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
