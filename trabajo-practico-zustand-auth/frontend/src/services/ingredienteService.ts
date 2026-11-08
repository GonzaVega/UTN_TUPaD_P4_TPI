import type { Ingrediente, IngredienteFormData } from "../types/ingrediente";
import { axiosInstance } from "../api/axiosInstance";

export const getIngredientes = async (): Promise<Ingrediente[]> => {
  const res = await axiosInstance.get<Ingrediente[]>("/ingredientes/");
  return res.data;
};

export const getIngredienteById = async (id: number): Promise<Ingrediente> => {
  const res = await axiosInstance.get<Ingrediente>(`/ingredientes/${id}`);
  return res.data;
};

export const createIngrediente = async (data: IngredienteFormData): Promise<Ingrediente> => {
  const res = await axiosInstance.post<Ingrediente>("/ingredientes/", data);
  return res.data;
};

export const updateIngrediente = async ({
  id,
  data,
}: {
  id: number;
  data: IngredienteFormData;
}): Promise<Ingrediente> => {
  const res = await axiosInstance.put<Ingrediente>(`/ingredientes/${id}`, data);
  return res.data;
};

export const deleteIngrediente = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/ingredientes/${id}`);
};
