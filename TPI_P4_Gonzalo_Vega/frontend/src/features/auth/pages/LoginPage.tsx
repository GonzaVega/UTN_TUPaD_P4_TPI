import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { handleApiError } from "../../../shared/api/handleApiError";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import { useAuthStore } from "../../../store/authStore";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const errors: Record<string, string> = {};
        if (!value.username.trim()) {
          errors.username = "El nombre de usuario es obligatorio";
        }
        if (!value.password) {
          errors.password = "La contraseña es obligatoria";
        }
        if (Object.keys(errors).length > 0) {
          return { fields: errors };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      setErrorServidor(null);
      try {
        const user = await login(value.username.trim(), value.password);
        if (user.role === "admin") {
          navigate("/admin/resumen");
        } else {
          navigate("/");
        }
      } catch (err) {
        setErrorServidor(handleApiError(err, "Credenciales incorrectas o error en el inicio de sesión"));
      }
    },
  });

  return (
    <div className="max-w-md mx-auto my-12">
      <Card padding="lg" className="shadow-lg border-slate-200">
        <div className="text-center mb-6">
          <span className="text-4xl">🔐</span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">Iniciar Sesión</h2>
          <p className="text-sm text-slate-500 mt-1">
            Ingresa a tu cuenta de Food Store
          </p>
        </div>

        {errorServidor && (
          <div className="p-3 mb-4 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-lg">
            {errorServidor}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Username */}
          <form.Field name="username">
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Usuario
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="admin o tu usuario..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 transition-colors"
                />
                {field.state.meta.errors.map((err) => (
                  <p key={String(err)} className="text-xs text-rose-600 mt-1">
                    {String(err)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          {/* Password */}
          <form.Field name="password">
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Contraseña
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 transition-colors"
                />
                {field.state.meta.errors.map((err) => (
                  <p key={String(err)} className="text-xs text-rose-600 mt-1">
                    {String(err)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                variant="primary"
                disabled={!canSubmit || isSubmitting}
                isLoading={isSubmitting}
                className="w-full mt-2 py-2.5"
              >
                Ingresar
              </Button>
            )}
          </form.Subscribe>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="font-semibold text-amber-600 hover:text-amber-700">
            Regístrate aquí
          </Link>
        </div>
      </Card>
    </div>
  );
};

