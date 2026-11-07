import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { handleApiError } from "../../../shared/api/handleApiError";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import { useCartStore } from "../../../store/cartStore";
import { useCrearPedido } from "../hooks/usePedidos";
import type { FormaPago } from "../types";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, vaciar } = useCartStore();
  const crearPedidoMutation = useCrearPedido();
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const totalMonetario = total();

  const form = useForm({
    defaultValues: {
      direccion_entrega: "",
      forma_pago: "EFECTIVO" as FormaPago,
      notas: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const errors: Record<string, string> = {};
        const dir = value.direccion_entrega.trim();
        if (!dir || dir.length < 5) {
          errors.direccion_entrega =
            "La dirección debe tener al menos 5 caracteres (calle, número, piso/depto)";
        } else if (dir.length > 200) {
          errors.direccion_entrega =
            "La dirección no puede superar los 200 caracteres";
        }
        if (!value.forma_pago) {
          errors.forma_pago = "Selecciona una forma de pago válida";
        }
        if (Object.keys(errors).length > 0) {
          return { fields: errors };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      if (items.length === 0) {
        setErrorServidor("El carrito se encuentra vacío.");
        return;
      }
      setErrorServidor(null);
      try {
        await crearPedidoMutation.mutateAsync({
          items: items.map((i) => ({
            producto_id: i.producto_id,
            cantidad: i.cantidad,
          })),
          forma_pago: value.forma_pago,
          direccion_entrega: value.direccion_entrega.trim(),
          notas: value.notas.trim() || undefined,
        });

        // Vacía el carrito local y redirige a Mis Pedidos
        vaciar();
        navigate("/mis-pedidos");
      } catch (err) {
        setErrorServidor(handleApiError(err, "Error al confirmar el pedido"));
      }
    },
  });

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 text-center">
        <Card padding="lg">
          <span className="text-4xl">🛒</span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Carrito vacío</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            No tienes ítems en el carrito para confirmar un pedido.
          </p>
          <Link to="/">
            <Button variant="primary" className="w-full">
              Ir al Catálogo
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Checkout — Finalizar Pedido
        </h1>
        <p className="text-xs text-slate-500">
          Ingresa los datos de envío y la forma de pago para procesar tu orden
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-2">
          <Card padding="lg" className="border-slate-200 shadow-sm">
            {errorServidor && (
              <div className="p-3 mb-6 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-lg">
                {errorServidor}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              {/* Dirección */}
              <form.Field name="direccion_entrega">
                {(field) => (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                    >
                      Dirección de Entrega * (5 a 200 caracteres)
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ej: Av. Santa Fe 2345, 4° B, CABA"
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

              {/* Forma de Pago */}
              <form.Field name="forma_pago">
                {(field) => (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Forma de Pago *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className={`p-3.5 border rounded-xl flex items-center space-x-3 cursor-pointer transition-all ${
                          field.state.value === "EFECTIVO"
                            ? "border-amber-600 bg-amber-50/50 text-amber-900 font-bold"
                            : "border-slate-300 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name={field.name}
                          value="EFECTIVO"
                          checked={field.state.value === "EFECTIVO"}
                          onChange={() => field.handleChange("EFECTIVO")}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-sm">💵 Efectivo al recibir</span>
                      </label>

                      <label
                        className={`p-3.5 border rounded-xl flex items-center space-x-3 cursor-pointer transition-all ${
                          field.state.value === "TRANSFERENCIA"
                            ? "border-amber-600 bg-amber-50/50 text-amber-900 font-bold"
                            : "border-slate-300 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name={field.name}
                          value="TRANSFERENCIA"
                          checked={field.state.value === "TRANSFERENCIA"}
                          onChange={() => field.handleChange("TRANSFERENCIA")}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-sm">📲 Transferencia bancaria</span>
                      </label>
                    </div>
                  </div>
                )}
              </form.Field>

              {/* Notas opcionales */}
              <form.Field name="notas">
                {(field) => (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                    >
                      Aclaraciones o Notas para la Cocina (Opcional)
                    </label>
                    <textarea
                      id={field.name}
                      name={field.name}
                      rows={2}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ej: Tocar timbre, no poner mayonesa, traer cambio de $5000..."
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 transition-colors resize-none"
                    />
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
                    className="w-full py-3 mt-4 text-base"
                  >
                    Confirmar Pedido (${totalMonetario.toFixed(2)})
                  </Button>
                )}
              </form.Subscribe>
            </form>
          </Card>
        </div>

        {/* Resumen lateral */}
        <div>
          <Card padding="md" className="space-y-4 sticky top-24">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Platos en el Pedido ({items.length})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.producto_id} className="flex justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">
                      {i.cantidad}x {i.nombre}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900">
                    ${(i.precio_unitario * i.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${totalMonetario.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Envío</span>
                <span className="text-emerald-600 font-bold">Gratis</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-base font-black text-slate-900">
                <span>Total</span>
                <span className="text-amber-600">${totalMonetario.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

