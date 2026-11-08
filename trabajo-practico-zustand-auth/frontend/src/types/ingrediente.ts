export interface Ingrediente {
  id: number;
  nombre: string;
  activo?: boolean;
}

export interface IngredienteFormData {
  nombre: string;
}
