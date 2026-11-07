import type { Categoria } from "../categorias/types";

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
  imagen_url?: string | null;
  stock: number;
  disponible: boolean;
  activo: boolean;
  categoria_id: number;
  categoria?: Categoria | null;
}

export interface ProductosPaginados {
  total: number;
  items: Producto[];
}

export interface ProductoCreatePayload {
  nombre: string;
  descripcion?: string;
  precio_base: number;
  imagen_url?: string;
  stock: number;
  disponible: boolean;
  categoria_id: number;
}

export interface ProductoUpdatePayload {
  nombre?: string;
  descripcion?: string;
  precio_base?: number;
  imagen_url?: string;
  stock?: number;
  disponible?: boolean;
  categoria_id?: number;
}

export interface ProductoStockUpdatePayload {
  stock: number;
  disponible: boolean;
}

export interface ProductoQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  categoria_id?: number;
  disponible?: boolean;
}

