import React from "react";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import { useCartStore } from "../../../store/cartStore";
import type { Producto } from "../types";

export interface ProductoCardProps {
  producto: Producto;
}

export const ProductoCard: React.FC<ProductoCardProps> = ({ producto }) => {
  const agregar = useCartStore((state) => state.agregar);
  const cartItem = useCartStore((state) =>
    state.items.find((i) => i.producto_id === producto.id)
  );

  const cantidadEnCarrito = cartItem?.cantidad ?? 0;
  const sinStock = producto.stock <= 0;
  const noDisponible = !producto.disponible;
  const puedeComprar = !sinStock && !noDisponible && cantidadEnCarrito < producto.stock;

  const handleAgregar = () => {
    if (!puedeComprar) return;
    agregar(
      {
        producto_id: producto.id,
        nombre: producto.nombre,
        precio_unitario: producto.precio_base,
        stock_disponible: producto.stock,
        imagen_url: producto.imagen_url || undefined,
      },
      1
    );
  };

  return (
    <Card
      padding="none"
      className="overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200 border-slate-200"
    >

      <div className="relative w-full h-48 bg-slate-100 overflow-hidden flex items-center justify-center">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="text-4xl select-none">🍔</span>
        )}

        {producto.categoria && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-slate-100">
            {producto.categoria.nombre}
          </span>
        )}

        {(noDisponible || sinStock) && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-rose-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-lg shadow-md">
              {noDisponible ? "No Disponible" : "Sin Stock"}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-1">
            {producto.nombre}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[32px]">
            {producto.descripcion || "Plato fresco y delicioso preparado al momento."}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Precio</span>
            <span className="text-xl font-black text-slate-900">
              ${producto.precio_base.toFixed(2)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">
              Stock: {producto.stock}
            </span>
            {cantidadEnCarrito > 0 && (
              <span className="text-[11px] text-amber-700 font-bold block">
                En carrito: {cantidadEnCarrito}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant={puedeComprar ? "primary" : "outline"}
            disabled={!puedeComprar}
            onClick={handleAgregar}
            className="w-full text-xs py-2.5"
          >
            {noDisponible
              ? "Agotado"
              : sinStock
              ? "Sin Stock"
              : cantidadEnCarrito >= producto.stock
              ? "Límite de stock alcanzado"
              : "+ Agregar al Carrito"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

