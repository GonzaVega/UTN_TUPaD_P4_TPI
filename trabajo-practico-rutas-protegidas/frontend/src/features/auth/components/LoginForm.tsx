import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "@tanstack/react-form"
import { useAuth } from "../hooks/useAuth"
import { Button } from "@/shared/components/Button"

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null)
      try {
        await login(value.email, value.password)
        navigate("/categories")
      } catch (err: unknown) {
        let msg = "Error al iniciar sesión. Verifica tus credenciales."
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
    <div className="space-y-4">
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
        <form.Field
          name="email"
          validators={{
            onBlur: ({ value }) => (!value.trim() ? "El email es obligatorio." : undefined),
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
                placeholder="usuario@foodstore.com"
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
          name="password"
          validators={{
            onBlur: ({ value }) => (!value ? "La contraseña es obligatoria." : undefined),
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
                placeholder="••••••••"
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
              {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}

