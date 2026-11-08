import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { axiosInstance } from "../api/axiosInstance";
import { Button } from "../components/common/Button";

export function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      celular: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        await axiosInstance.post("/auth/register", {
          nombre: value.nombre,
          apellido: value.apellido,
          email: value.email,
          celular: value.celular ? value.celular : undefined,
          password: value.password,
        });
        navigate("/login");
      } catch (err: any) {
        const msg = err.response?.data?.detail || "Error al registrar la cuenta.";
        setServerError(typeof msg === "string" ? msg : JSON.stringify(msg));
      }
    },
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Crear Cuenta</h2>
          <p className="text-sm text-slate-500 mt-1">Regístrate para comenzar a ordenar en Food Store</p>
        </div>

        {serverError && (
          <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
            {serverError}
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
          <div className="grid grid-cols-2 gap-3">
            <form.Field
              name="nombre"
              validators={{
                onBlur: ({ value }) => (!value.trim() ? "El nombre es obligatorio." : undefined),
              }}
            >
              {(field) => (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Juan"
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

            <form.Field
              name="apellido"
              validators={{
                onBlur: ({ value }) => (!value.trim() ? "El apellido es obligatorio." : undefined),
              }}
            >
              {(field) => (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Pérez"
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
          </div>

          <form.Field
            name="email"
            validators={{
              onBlur: ({ value }) => (!value.trim() ? "El email es obligatorio." : undefined),
            }}
          >
            {(field) => (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="juan.perez@ejemplo.com"
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

          <form.Field name="celular">
            {(field) => (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Celular (opcional)
                </label>
                <input
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="1122334455"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                />
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onBlur: ({ value }) =>
                value.length < 8 ? "La contraseña debe tener al menos 8 caracteres." : undefined,
            }}
          >
            {(field) => (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Contraseña * (mínimo 8 caracteres)
                </label>
                <input
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
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

          <Button type="submit" className="w-full py-2.5 shadow-xs">
            Registrarse
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

