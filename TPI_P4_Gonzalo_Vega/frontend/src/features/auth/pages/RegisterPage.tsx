import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { handleApiError } from "../../../shared/api/handleApiError";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import { authApi } from "../api/authApi";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const errors: Record<string, string> = {};
        if (!value.username.trim() || value.username.trim().length < 3) {
          errors.username = "El nombre de usuario debe tener al menos 3 caracteres";
        }
        if (!value.full_name.trim() || value.full_name.trim().length < 2) {
          errors.full_name = "El nombre completo debe tener al menos 2 caracteres";
        }
        if (!value.email.trim() || !value.email.includes("@")) {
          errors.email = "Ingrese un correo electrónico válido";
        }
        if (!value.password || value.password.length < 8) {
          errors.password = "La contraseña debe tener un mínimo de 8 caracteres";
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
        await authApi.register({
          username: value.username.trim(),
          full_name: value.full_name.trim(),
          email: value.email.trim(),
          password: value.password,
        });
        navigate("/login", {
          state: { mensaje: "¡Registro exitoso! Por favor inicia sesión." },
        });
      } catch (err) {
        setErrorServidor(handleApiError(err, "Error al registrar usuario"));
      }
    },
  });

  return (
    <div className="max-w-md mx-auto my-12">
      <Card padding="lg" className="shadow-lg border-slate-200">
        <div className="text-center mb-6">
          <span className="text-4xl">📝</span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">Crear Cuenta</h2>
          <p className="text-sm text-slate-500 mt-1">
            Regístrate para realizar pedidos en Food Store
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
                  Usuario *
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="juanperez"
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

          {/* Full Name */}
          <form.Field name="full_name">
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Nombre Completo *
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Juan Pérez"
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

          {/* Email */}
          <form.Field name="email">
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Correo Electrónico *
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="juan@ejemplo.com"
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
                  Contraseña (mínimo 8 caracteres) *
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
                Crear Cuenta
              </Button>
            )}
          </form.Subscribe>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-700">
            Inicia sesión
          </Link>
        </div>
      </Card>
    </div>
  );
};

