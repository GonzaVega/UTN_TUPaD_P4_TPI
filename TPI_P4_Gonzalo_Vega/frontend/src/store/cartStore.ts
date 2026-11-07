import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  stock_disponible: number;
  imagen_url?: string;
}

interface CartState {
  items: CartItem[];
  agregar: (item: Omit<CartItem, "cantidad">, cantidad?: number) => void;
  quitar: (producto_id: number) => void;
  cambiarCantidad: (producto_id: number, cantidad: number) => void;
  vaciar: () => void;
  total: () => number;
  totalCantidad: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      agregar: (item, cantidad = 1) => {
        set((state) => {
          const existente = state.items.find((i) => i.producto_id === item.producto_id);
          if (existente) {
            const nuevaCantidad = Math.min(
              existente.cantidad + cantidad,
              item.stock_disponible
            );
            return {
              items: state.items.map((i) =>
                i.producto_id === item.producto_id
                  ? { ...i, cantidad: nuevaCantidad, stock_disponible: item.stock_disponible }
                  : i
              ),
            };
          }
          const cantValida = Math.min(cantidad, item.stock_disponible);
          return {
            items: [...state.items, { ...item, cantidad: cantValida }],
          };
        });
      },

      quitar: (producto_id: number) => {
        set((state) => ({
          items: state.items.filter((i) => i.producto_id !== producto_id),
        }));
      },

      cambiarCantidad: (producto_id: number, cantidad: number) => {
        set((state) => {
          if (cantidad <= 0) {
            return {
              items: state.items.filter((i) => i.producto_id !== producto_id),
            };
          }
          return {
            items: state.items.map((i) => {
              if (i.producto_id === producto_id) {
                const cant = Math.min(cantidad, i.stock_disponible);
                return { ...i, cantidad: cant };
              }
              return i;
            }),
          };
        });
      },

      vaciar: () => {
        set({ items: [] });
      },

      total: () => {
        const items = get().items;
        const sum = items.reduce(
          (acc, item) => acc + item.precio_unitario * item.cantidad,
          0
        );
        return Math.round(sum * 100) / 100;
      },

      totalCantidad: () => {
        const items = get().items;
        return items.reduce((acc, item) => acc + item.cantidad, 0);
      },
    }),
    {
      name: "foodstore-cart",
    }
  )
);

