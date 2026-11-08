import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import type { Categoria, CategoriaFormData } from "../types/categoria";
import { Button } from "./common/Button";

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
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const esEdicion = Boolean(categoriaParaEditar);

  const defaultValues: CategoriaFormData = {
    nombre: categoriaParaEditar?.nombre ?? "",
    descripcion: categoriaParaEditar?.descripcion ?? "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: ({ value }) => {
        if (!value.nombre.trim()) {
          return {
            fields: {
              nombre: "El nombre de la categoría es obligatorio.",
            },
          };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      setErrorServidor(null);
      try {
        await onSubmit({
          nombre: value.nombre.trim(),
          descripcion: value.descripcion.trim(),
        });
        onClose();
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorServidor(err.message);
        } else {
          setErrorServidor("Ocurrió un error al guardar la categoría.");
        }
      }
    },
  });

  const handleClose = () => {
    setErrorServidor(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {esEdicion ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="mt-4 space-y-4"
        >
          {errorServidor && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {errorServidor}
            </div>
          )}

          <form.Field
            name="nombre"
            validators={{
              onChange: ({ value }) =>
                value.length > 0 && !value.trim()
                  ? "El nombre no puede ser solo espacios."
                  : undefined,
              onBlur: ({ value }) =>
                !value.trim()
                  ? "El nombre de la categoría es obligatorio."
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Nombre de la categoría *
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej: Pizzas, Hamburguesas, Bebidas..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                />
                {field.state.meta.errors.map((err) => (
                  <p key={String(err)} className="text-rose-500 text-xs mt-1">
                    {String(err)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="descripcion">
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Descripción
                </label>
                <textarea
                  id={field.name}
                  name={field.name}
                  rows={3}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Descripción breve de los productos que abarca..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors resize-none"
                />
              </div>
            )}
          </form.Field>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={handleClose}
              className="text-sm px-4 py-2 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </Button>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!canSubmit || isSubmitting}
                  className="text-sm px-5 py-2 shadow-xs"
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}
