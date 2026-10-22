import type { Categoria, CategoriaFormData } from "../types/categoria";
import { formatErrorDetail } from "./apiError";

const API_BASE_URL = "http://localhost:8000";

export const getCategorias = async (): Promise<Categoria[]> => {
  const res = await fetch(`${API_BASE_URL}/categorias/`);
  if (!res.ok) {
    throw new Error(
      `Error ${res.status}: No se pudo cargar el listado de categorías.`,
    );
  }
  return res.json();
};

export const getCategoriaById = async (id: number): Promise<Categoria> => {
  const res = await fetch(`${API_BASE_URL}/categorias/${id}`);
  if (!res.ok) {
    throw new Error(
      `Error ${res.status}: No se pudo obtener la categoría con ID ${id}.`,
    );
  }
  return res.json();
};

export const createCategoria = async (
  data: CategoriaFormData,
): Promise<Categoria> => {
  const res = await fetch(`${API_BASE_URL}/categorias/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      formatErrorDetail(errorJson?.detail, "No se pudo registrar la categoría."),
    );
  }

  return res.json();
};

export const updateCategoria = async ({
  id,
  data,
}: {
  id: number;
  data: CategoriaFormData;
}): Promise<Categoria> => {
  const res = await fetch(`${API_BASE_URL}/categorias/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      formatErrorDetail(errorJson?.detail, "No se pudo actualizar la categoría."),
    );
  }

  return res.json();
};

export const deleteCategoria = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/categorias/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      formatErrorDetail(errorJson?.detail, "No se pudo eliminar la categoría."),
    );
  }
};
