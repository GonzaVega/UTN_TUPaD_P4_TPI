import { useState } from "react"
import type { Producto, ProductoFormData } from "../types/producto"
import { useProducts } from "../hooks/useProducts"
import { ProductoTable } from "../components/ProductoTable"
import { ProductoModal } from "../components/ProductoModal"
import { ProductoDetailModal } from "../components/ProductoDetailModal"
import { useAuthStore } from "@/features/auth"
import { LoadingState } from "@/shared/components/LoadingState"
import { ErrorState } from "@/shared/components/ErrorState"
import { EmptyState } from "@/shared/components/EmptyState"
import { Button } from "@/shared/components/Button"

export function ProductsPage() {
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.roles.includes("admin")

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null)
  const [cardModalProducto, setCardModalProducto] = useState<Producto | null>(null)

  const {
    products: productos,
    isLoading,
    isError,
    error,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts()

  const handleOpenCreateModal = () => {
    setSelectedProducto(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (producto: Producto) => {
    setSelectedProducto(producto)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProducto(null)
  }

  const handleModalSubmit = async (formData: ProductoFormData) => {
    if (selectedProducto) {
      await updateProduct(selectedProducto.id, formData)
    } else {
      await createProduct(formData)
    }
  }

  const handleDelete = (id: number) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    )
    if (!confirmacion) return
    deleteProduct(id)
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Productos
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestión de platos, combos y bebidas disponibles para la venta
          </p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            onClick={handleOpenCreateModal}
            className="self-start sm:self-auto shadow-sm"
          >
            Nuevo Producto
          </Button>
        )}
      </div>

      {isLoading && <LoadingState mensaje="Cargando productos..." />}

      {isError && (
        <ErrorState
          titulo="Error al cargar los productos:"
          error={error}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && productos.length === 0 && (
        <EmptyState
          titulo="No hay productos registrados"
          descripcion="Empieza agregando tu primer producto al menú con el botón superior."
          onAction={isAdmin ? handleOpenCreateModal : undefined}
          textoAccion="Crear Primer Producto"
        />
      )}

      {!isLoading && !isError && productos.length > 0 && (
        <ProductoTable
          data={productos}
          onViewCard={(producto) => setCardModalProducto(producto)}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      <ProductoModal
        isOpen={isModalOpen}
        productoParaEditar={selectedProducto}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
      />

      <ProductoDetailModal
        producto={cardModalProducto}
        onClose={() => setCardModalProducto(null)}
      />
    </div>
  )
}

