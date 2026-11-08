import type { Categoria } from "../types/categoria"
import { CategoriaTable } from "./CategoriaTable"

export interface CategoriaListProps {
  categorias: Categoria[]
  onEdit: (categoria: Categoria) => void
  onDelete: (id: number) => void
}

export function CategoriaList({
  categorias,
  onEdit,
  onDelete,
}: CategoriaListProps) {
  return (
    <CategoriaTable
      data={categorias}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}

