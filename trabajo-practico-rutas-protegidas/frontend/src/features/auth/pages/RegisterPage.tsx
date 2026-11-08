import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "@tanstack/react-form"
import { useAuth } from "../hooks/useAuth"
import { Button } from "@/shared/components/Button"

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      celular: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null)
      try {
        await register({
          nombre: value.nombre,
          apellido: value.apellido,
          email: value.email,
          celular: value.celular ? value.celular : undefined,
          password: value.password,
        })
        navigate("/login")
      } catch (err: unknown) {
        let msg = "Error al registrar la cuenta."
        if (err && typeof err === "object" && "response" in err) {
          const res = (err as { response?: { data?: { detail?: string } } }).response
          if (res?.data?.detail) {
            msg = typeof res.data.detail === "string" ? res.data.detail : JSON.stringify(res.data.detail)
          }
        }
        setServerError(msg)
      }
    },
  })

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Crear Cuenta</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Regístrate para comenzar a ordenar en Food Store</p>
        </div>

        {serverError && (
          <div className="p-3 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-lg">
            {serverError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <form.Field
              name="nombre"
              validators={{
                onBlur: ({ value }) => (!value.trim() ? "El nombre es obligatorio." : undefined),
              }}
            >
              {(field) => (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Juan"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                  />
                  {field.state.meta.errors.map((err) => (
                    <p key={String(err)} className="text-rose-500 text-xs mt-1">
                      {String(err)}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field
              name="apellido"
              validators={{
                onBlur: ({ value }) => (!value.trim() ? "El apellido es obligatorio." : undefined),
              }}
            >
              {(field) => (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Pérez"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                  />
                  {field.state.meta.errors.map((err) => (
                    <p key={String(err)} className="text-rose-500 text-xs mt-1">
                      {String(err)}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field
            name="email"
            validators={{
              onBlur: ({ value }) => {
                if (!value.trim()) return "El email es obligatorio."
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email inválido."
                return undefined
              },
            }}
          >
            {(field) => (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="juan@foodstore.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                />
                {field.state.meta.errors.map((err) => (
                  <p key={String(err)} className="text-rose-500 text-xs mt-1">
                    {String(err)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="celular">
            {(field) => (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Celular
                </label>
                <input
                  type="tel"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="+54 9 11 1234-5678"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                />
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "La contraseña es obligatoria."
                if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres."
                return undefined
              },
            }}
          >
            {(field) => (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                />
                {field.state.meta.errors.map((err) => (
                  <p key={String(err)} className="text-rose-500 text-xs mt-1">
                    {String(err)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                variant="primary"
                disabled={!canSubmit || isSubmitting}
                className="w-full py-2.5 justify-center shadow-md shadow-blue-500/20"
              >
                {isSubmitting ? "Registrando cuenta..." : "Crear Cuenta"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 text-center text-xs text-slate-600 dark:text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

