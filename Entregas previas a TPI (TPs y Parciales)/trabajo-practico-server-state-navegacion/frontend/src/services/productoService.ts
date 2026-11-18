import type { Producto } from "../types/producto";

const API_BASE_URL = "http://localhost:8000";

export const getProductos = async (): Promise<Producto[]> => {
  const res = await fetch(`${API_BASE_URL}/productos/`);
  if (!res.ok) {
    throw new Error(
      `Error ${res.status}: No se pudo cargar el listado de productos.`,
    );
  }
  return res.json();
};

export const getProductoById = async (id: number): Promise<Producto> => {
  const res = await fetch(`${API_BASE_URL}/productos/${id}`);
  if (!res.ok) {
    throw new Error(
      `Error ${res.status}: No se pudo obtener el producto con ID ${id}.`,
    );
  }
  return res.json();
};
