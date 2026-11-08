export interface Categoria {
  id: number
  nombre: string
  descripcion?: string | null
  color?: string | null
  activo?: boolean
}

export interface CategoriaFormData {
  nombre: string
  descripcion: string
  color?: string
}

