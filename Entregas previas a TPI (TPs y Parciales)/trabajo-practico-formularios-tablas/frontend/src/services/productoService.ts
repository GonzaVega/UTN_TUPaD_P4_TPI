import type { Producto, ProductoFormData } from "../types/producto";
import { formatErrorDetail } from "./apiError";

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

export const createProducto = async (
  data: ProductoFormData,
): Promise<Producto> => {
  const res = await fetch(`${API_BASE_URL}/productos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      formatErrorDetail(errorJson?.detail, "No se pudo registrar el producto."),
    );
  }

  return res.json();
};

export const updateProducto = async ({
  id,
  data,
}: {
  id: number;
  data: ProductoFormData;
}): Promise<Producto> => {
  const res = await fetch(`${API_BASE_URL}/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      formatErrorDetail(errorJson?.detail, "No se pudo actualizar el producto."),
    );
  }

  return res.json();
};

export const deleteProducto = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/productos/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      formatErrorDetail(errorJson?.detail, "No se pudo eliminar el producto."),
    );
  }
};
