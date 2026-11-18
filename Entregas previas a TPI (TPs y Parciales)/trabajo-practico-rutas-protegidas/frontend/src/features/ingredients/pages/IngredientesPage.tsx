import { useState } from "react"
import type { Ingrediente, IngredienteFormData } from "../types/ingrediente"
import { useIngredients } from "../hooks/useIngredients"
import { IngredienteTable } from "../components/IngredienteTable"
import { IngredienteModal } from "../components/IngredienteModal"
import { useAuthStore } from "@/features/auth"
import { LoadingState } from "@/shared/components/LoadingState"
import { ErrorState } from "@/shared/components/ErrorState"
import { EmptyState } from "@/shared/components/EmptyState"
import { Button } from "@/shared/components/Button"

export function IngredientesPage() {
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.roles.includes("admin")

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedIngrediente, setSelectedIngrediente] =
    useState<Ingrediente | null>(null)

  const {
    ingredients: ingredientes,
    isLoading,
    isError,
    error,
    refetch,
    createIngredient,
    updateIngredient,
    deleteIngredient,
  } = useIngredients()

  const handleOpenCreateModal = () => {
    setSelectedIngrediente(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (ingrediente: Ingrediente) => {
    setSelectedIngrediente(ingrediente)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedIngrediente(null)
  }

  const handleModalSubmit = async (formData: IngredienteFormData) => {
    if (selectedIngrediente) {
      await updateIngredient(selectedIngrediente.id, formData)
    } else {
      await createIngredient(formData)
    }
  }

  const handleDelete = (id: number) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar este ingrediente?"
    )
    if (!confirmacion) return
    deleteIngredient(id)
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Ingredientes
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestión y disponibilidad de ingredientes para personalización de recetas
          </p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            onClick={handleOpenCreateModal}
            className="self-start sm:self-auto shadow-sm"
          >
            Nuevo Ingrediente
          </Button>
        )}
      </div>

      {isLoading && <LoadingState mensaje="Cargando ingredientes..." />}

      {isError && (
        <ErrorState
          titulo="Error al cargar los ingredientes:"
          error={error}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && ingredientes.length === 0 && (
        <EmptyState
          titulo="No hay ingredientes registrados"
          descripcion="Empieza agregando tu primer ingrediente al catálogo utilizando el botón superior."
          onAction={isAdmin ? handleOpenCreateModal : undefined}
          textoAccion="Crear Primer Ingrediente"
        />
      )}

      {!isLoading && !isError && ingredientes.length > 0 && (
        <IngredienteTable
          data={ingredientes}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      <IngredienteModal
        isOpen={isModalOpen}
        ingredienteParaEditar={selectedIngrediente}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  )
}

