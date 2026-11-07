export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
}

export interface CategoriaCreatePayload {
  nombre: string;
  descripcion?: string;
}

export interface CategoriaUpdatePayload {
  nombre?: string;
  descripcion?: string;
}

