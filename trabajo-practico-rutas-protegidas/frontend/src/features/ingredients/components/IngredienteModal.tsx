import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import type { Ingrediente, IngredienteFormData } from "../types/ingrediente"
import { Button } from "@/shared/components/Button"

export interface IngredienteModalProps {
  isOpen: boolean
  ingredienteParaEditar: Ingrediente | null
  onClose: () => void
  onSubmit: (data: IngredienteFormData) => Promise<void>
}

export function IngredienteModal({
  isOpen,
  ingredienteParaEditar,
  onClose,
  onSubmit,
}: IngredienteModalProps) {
  const [errorServidor, setErrorServidor] = useState<string | null>(null)

  const esEdicion = Boolean(ingredienteParaEditar)

  const defaultValues: IngredienteFormData = {
    nombre: ingredienteParaEditar?.nombre ?? "",
  }

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: ({ value }) => {
        if (!value.nombre.trim()) {
          return {
            fields: {
              nombre: "El nombre del ingrediente es obligatorio.",
            },
          }
        }
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      setErrorServidor(null)
      try {
        await onSubmit({
          nombre: value.nombre.trim(),
        })
        onClose()
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorServidor(err.message)
        } else {
          setErrorServidor("Ocurrió un error al guardar el ingrediente.")
        }
      }
    },
  })

  const handleClose = () => {
    setErrorServidor(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {esEdicion ? "Editar Ingrediente" : "Nuevo Ingrediente"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg p-1 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="mt-4 space-y-4"
        >
          {errorServidor && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-lg">
              {errorServidor}
            </div>
          )}

          <form.Field name="nombre">
            {(field) => {
              const fieldError = field.state.meta.errors?.[0]
              return (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
                  >
                    Nombre del ingrediente *
                  </label>
                  <input
                    id={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Ej. Mozzarella, Albahaca, Salsa BBQ..."
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                  />
                  {fieldError && (
                    <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                      {String(fieldError)}
                    </p>
                  )}
                </div>
              )
            }}
          </form.Field>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={form.state.isSubmitting}
            >
              Cancelar
            </Button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  )
}

