import type { Categoria } from "@/features/categories"

export interface Producto {
  id: number
  nombre: string
  descripcion?: string | null
  precio_base: number
  imagen_url?: string | null
  disponible: boolean
  activo?: boolean
  categorias?: Categoria[]
}

export interface ProductoFormData {
  nombre: string
  descripcion: string
  precio_base: number
  imagen_url: string
  disponible: boolean
}

