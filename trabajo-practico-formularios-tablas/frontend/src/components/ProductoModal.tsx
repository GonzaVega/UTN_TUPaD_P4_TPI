import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import type { Producto, ProductoFormData } from "../types/producto";
import { Button } from "./common/Button";

export interface ProductoModalProps {
  isOpen: boolean;
  productoParaEditar: Producto | null;
  onClose: () => void;
  onSubmit: (data: ProductoFormData) => Promise<void>;
}

export function ProductoModal({
  isOpen,
  productoParaEditar,
  onClose,
  onSubmit,
}: ProductoModalProps) {
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const esEdicion = Boolean(productoParaEditar);

  const defaultValues: ProductoFormData = {
    nombre: productoParaEditar?.nombre ?? "",
    descripcion: productoParaEditar?.descripcion ?? "",
    precio_base: productoParaEditar?.precio_base ?? 0,
    imagen_url: productoParaEditar?.imagen_url ?? "",
    disponible: productoParaEditar?.disponible ?? true,
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: ({ value }) => {
        const errores: Record<string, string> = {};
        if (!value.nombre.trim()) {
          errores.nombre = "El nombre del producto es obligatorio.";
        }
        if (value.precio_base < 0 || isNaN(value.precio_base)) {
          errores.precio_base = "El precio debe ser un número mayor o igual a 0.";
        }
        if (Object.keys(errores).length > 0) {
          return { fields: errores };
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
          precio_base: Number(value.precio_base),
          imagen_url: value.imagen_url.trim(),
          disponible: Boolean(value.disponible),
        });
        onClose();
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorServidor(err.message);
        } else {
          setErrorServidor("Ocurrió un error al guardar el producto.");
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {esEdicion ? "Editar Producto" : "Nuevo Producto"}
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

          {/* Campo Nombre */}
          <form.Field
            name="nombre"
            validators={{
              onBlur: ({ value }) =>
                !value.trim() ? "El nombre es obligatorio." : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Nombre del producto *
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej: Pizza Napolitana, Cheeseburger..."
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

          {/* Campo Precio Base */}
          <form.Field
            name="precio_base"
            validators={{
              onChange: ({ value }) =>
                value < 0 ? "El precio no puede ser negativo." : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Precio Base ($) *
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  placeholder="0.00"
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

          {/* Campo Descripción */}
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
                  placeholder="Ingredientes, preparación, características..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors resize-none"
                />
              </div>
            )}
          </form.Field>

          {/* Campo URL de Imagen */}
          <form.Field name="imagen_url">
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                >
                  URL de Imagen
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="url"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                />
              </div>
            )}
          </form.Field>

          {/* Campo Disponible (Checkbox) */}
          <form.Field name="disponible">
            {(field) => (
              <div className="flex items-center space-x-2 pt-1">
                <input
                  id={field.name}
                  name={field.name}
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium text-slate-700 select-none cursor-pointer"
                >
                  Producto disponible para venta inmediata
                </label>
              </div>
            )}
          </form.Field>

          {/* Botones de acción */}
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
                  {isSubmitting ? "Guardando..." : "Guardar Producto"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}
