import type { Ingrediente, IngredienteFormData } from "../types/ingrediente";
import { formatErrorDetail } from "./apiError";

const API_BASE_URL = "http://localhost:8000";

export const getIngredientes = async (): Promise<Ingrediente[]> => {
  const res = await fetch(`${API_BASE_URL}/ingredientes/`);
  if (!res.ok) {
    throw new Error(
      `Error ${res.status}: No se pudo cargar el listado de ingredientes.`,
    );
  }
  return res.json();
};

export const getIngredienteById = async (id: number): Promise<Ingrediente> => {
  const res = await fetch(`${API_BASE_URL}/ingredientes/${id}`);
  if (!res.ok) {
    throw new Error(
      `Error ${res.status}: No se pudo obtener el ingrediente con ID ${id}.`,
    );
  }
  return res.json();
};

export const createIngrediente = async (
  data: IngredienteFormData,
): Promise<Ingrediente> => {
  const res = await fetch(`${API_BASE_URL}/ingredientes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      formatErrorDetail(
        errorJson?.detail,
        "No se pudo registrar el ingrediente.",
      ),
    );
  }

  return res.json();
};

export const updateIngrediente = async ({
  id,
  data,
}: {
  id: number;
  data: IngredienteFormData;
}): Promise<Ingrediente> => {
  const res = await fetch(`${API_BASE_URL}/ingredientes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      formatErrorDetail(
        errorJson?.detail,
        "No se pudo actualizar el ingrediente.",
      ),
    );
  }

  return res.json();
};

export const deleteIngrediente = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/ingredientes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      formatErrorDetail(
        errorJson?.detail,
        "No se pudo eliminar el ingrediente.",
      ),
    );
  }
};
