export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  activo?: boolean;
}

export interface CategoriaFormData {
  nombre: string;
  descripcion: string;
}
