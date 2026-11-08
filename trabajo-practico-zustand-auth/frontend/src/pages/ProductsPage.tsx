import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Producto, ProductoFormData } from "../types/producto";
import {
  createProducto,
  deleteProducto,
  getProductos,
  updateProducto,
} from "../services/productoService";
import { ProductoTable } from "../components/ProductoTable";
import { ProductoModal } from "../components/ProductoModal";
import { ProductoDetailModal } from "../components/ProductoDetailModal";
import { useAuthStore } from "../store/authStore";

import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { Button } from "../components/common/Button";

export function ProductsPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roles.includes("admin");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null,
  );
  const [cardModalProducto, setCardModalProducto] = useState<Producto | null>(
    null,
  );

  const {
    data: productos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Producto[]>({
    queryKey: ["productos"],
    queryFn: getProductos,
  });

  const createMutation = useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
    onError: (err: unknown) => {
      alert(
        err instanceof Error ? err.message : "Error al eliminar el producto.",
      );
    },
  });

  const handleOpenCreateModal = () => {
    setSelectedProducto(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (producto: Producto) => {
    setSelectedProducto(producto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProducto(null);
  };

  const handleModalSubmit = async (formData: ProductoFormData) => {
    if (selectedProducto) {
      await updateMutation.mutateAsync({
        id: selectedProducto.id,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleDelete = (id: number) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?",
    );
    if (!confirmacion) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Productos
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            CRUD completo de productos con TanStack Table v8, TanStack Form y TanStack Query.
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center space-x-2 text-sm px-4 py-2.5 shadow-xs"
          >
            <span>+</span>
            <span>Nuevo Producto</span>
          </Button>
        )}
      </div>

      {isError && (
        <ErrorState
          titulo="Error al cargar productos:"
          error={error}
          onRetry={() => refetch()}
        />
      )}

      {isLoading ? (
        <LoadingState mensaje="Consultando catálogo con useQuery y TanStack Table..." />
      ) : productos.length === 0 ? (
        <EmptyState
          titulo="No hay productos registrados"
          descripcion="Comienza añadiendo tu primer producto al catálogo."
          textoBoton={isAdmin ? "Nuevo Producto" : undefined}
          onAccion={isAdmin ? handleOpenCreateModal : undefined}
        />
      ) : (
        <ProductoTable
          data={productos}
          onViewCard={(prod) => setCardModalProducto(prod)}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <ProductoModal
          key={selectedProducto?.id ?? "nuevo-producto"}
          isOpen={isModalOpen}
          productoParaEditar={selectedProducto}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
        />
      )}

      <ProductoDetailModal
        producto={cardModalProducto}
        onClose={() => setCardModalProducto(null)}
      />
    </div>
  );
}
