import type { UnidadMedida } from "./unidadMedida";
import type { Categoria } from "./categoria";

export interface Producto {
  id: number;
  unidad_venta_id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  stock_cantidad: number;
  disponible: boolean;
  activo: boolean;
  anulado_at: string | null;
  hay_stock: boolean;
  unidad_venta: UnidadMedida;
  categorias: Categoria[];
}

export interface ProductoFormData {
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
  unidad_venta_id: number;
  stock_cantidad: number;
  disponible: boolean;
}

