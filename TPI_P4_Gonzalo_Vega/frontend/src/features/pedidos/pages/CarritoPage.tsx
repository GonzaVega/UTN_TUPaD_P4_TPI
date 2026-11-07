import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import { useCartStore } from "../../../store/cartStore";

export const CarritoPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, cambiarCantidad, quitar, vaciar, total } = useCartStore();

  const totalMonetario = total();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12">
        <EstadoVacio
          titulo="Tu carrito está vacío"
          descripcion="Aún no has agregado platos a tu pedido. Explora nuestro menú y elige lo que más te guste."
          icono="🛒"
          textoAccion="Explorar Catálogo"
          onAccion={() => navigate("/")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Carrito de Compras
          </h1>
          <p className="text-xs text-slate-500">
            Revisa tus platos antes de confirmar tu pedido
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm("¿Deseas vaciar todo el carrito?")) {
              vaciar();
            }
          }}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Ítems */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <Card key={item.producto_id} padding="sm" className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 flex items-center justify-center">
                {item.imagen_url ? (
                  <img
                    src={item.imagen_url}
                    alt={item.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">🍔</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-sm truncate">
                  {item.nombre}
                </h4>
                <p className="text-xs text-slate-500">
                  ${item.precio_unitario.toFixed(2)} c/u
                </p>
                <p className="text-xs font-black text-slate-800 mt-0.5">
                  Subtotal: ${(item.precio_unitario * item.cantidad).toFixed(2)}
                </p>
              </div>

              {/* Controles de cantidad */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() =>
                    cambiarCantidad(item.producto_id, item.cantidad - 1)
                  }
                  className="w-7 h-7 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
                  title="Disminuir"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-bold text-slate-800">
                  {item.cantidad}
                </span>
                <button
                  type="button"
                  disabled={item.cantidad >= item.stock_disponible}
                  onClick={() =>
                    cambiarCantidad(item.producto_id, item.cantidad + 1)
                  }
                  className="w-7 h-7 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-sm cursor-pointer"
                  title="Aumentar"
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={() => quitar(item.producto_id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-2 cursor-pointer"
                  title="Eliminar del carrito"
                >
                  ✕
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Resumen de Compra */}
        <div>
          <Card padding="md" className="space-y-4 sticky top-24">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
              Resumen del Pedido
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({items.length} platos)</span>
                <span>${totalMonetario.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Costo de envío</span>
                <span className="text-emerald-600 font-bold">¡Gratis!</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between font-black text-slate-900 text-lg">
                <span>Total a pagar</span>
                <span className="text-amber-600">${totalMonetario.toFixed(2)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full py-3"
              onClick={() => navigate("/checkout")}
            >
              Confirmar Pedido →
            </Button>

            <Link
              to="/"
              className="block text-center text-xs font-semibold text-slate-500 hover:text-slate-800 pt-1"
            >
              ← Seguir explorando el menú
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

