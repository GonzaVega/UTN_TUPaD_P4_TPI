import { useState } from "react"
import type { Categoria, CategoriaFormData } from "../types/categoria"
import { useCategories } from "../hooks/useCategories"
import { CategoriaTable } from "../components/CategoriaTable"
import { CategoriaModal } from "../components/CategoriaModal"
import { useAuthStore } from "@/features/auth"
import { LoadingState } from "@/shared/components/LoadingState"
import { ErrorState } from "@/shared/components/ErrorState"
import { EmptyState } from "@/shared/components/EmptyState"
import { Button } from "@/shared/components/Button"

export function CategoriasPage() {
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.roles.includes("admin")

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null)

  const {
    categories: categorias,
    isLoading,
    isError,
    error,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories()

  const handleOpenCreateModal = () => {
    setSelectedCategoria(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (categoria: Categoria) => {
    setSelectedCategoria(categoria)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCategoria(null)
  }

  const handleModalSubmit = async (formData: CategoriaFormData) => {
    if (selectedCategoria) {
      await updateCategory(selectedCategoria.id, formData)
    } else {
      await createCategory(formData)
    }
  }

  const handleDelete = (id: number) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar esta categoría?"
    )
    if (!confirmacion) return
    deleteCategory(id)
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Categorías
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestión y catálogo de familias de productos del restaurante
          </p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            onClick={handleOpenCreateModal}
            className="self-start sm:self-auto shadow-sm"
          >
            Nueva Categoría
          </Button>
        )}
      </div>

      {isLoading && <LoadingState mensaje="Cargando categorías..." />}

      {isError && (
        <ErrorState
          titulo="Error al cargar las categorías:"
          error={error}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && categorias.length === 0 && (
        <EmptyState
          titulo="No hay categorías registradas"
          descripcion="Empieza agregando tu primera categoría de menú utilizando el botón superior."
          onAction={isAdmin ? handleOpenCreateModal : undefined}
          textoAccion="Crear Primera Categoría"
        />
      )}

      {!isLoading && !isError && categorias.length > 0 && (
        <CategoriaTable
          data={categorias}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      <CategoriaModal
        isOpen={isModalOpen}
        categoriaParaEditar={selectedCategoria}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  )
}

