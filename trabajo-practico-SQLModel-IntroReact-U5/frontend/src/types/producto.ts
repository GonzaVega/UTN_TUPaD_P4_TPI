/**
 * Interface que representa la entidad Producto en el frontend.
 * Cumple con RN-07: Refleja los campos del modelo del backend (id, nombre, descripcion, precio)
 * y campos complementarios para sincronización completa.
 */
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria?: string;
  stock?: number;
  stock_minimo?: number;
  activo?: boolean;
}
