import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Categoria, CategoriaFormData } from "../types/categoria";
import {
  createCategoria,
  deleteCategoria,
  getCategorias,
  updateCategoria,
} from "../services/categoriaService";
import { CategoriaList } from "../components/CategoriaList";
import { CategoriaModal } from "../components/CategoriaModal";

import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { Button } from "../components/common/Button";

export function CategoriasPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    null,
  );

  const {
    data: categorias = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });

  const createMutation = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
    onError: (err: unknown) => {
      alert(
        err instanceof Error ? err.message : "Error al eliminar la categoría.",
      );
    },
  });

  const handleOpenCreateModal = () => {
    setSelectedCategoria(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategoria(null);
  };

  const handleModalSubmit = async (formData: CategoriaFormData) => {
    if (selectedCategoria) {
      await updateMutation.mutateAsync({
        id: selectedCategoria.id,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleDelete = (id: number) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar esta categoría?",
    );
    if (!confirmacion) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Categorías
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gestión completa de categorías con TanStack Table v8, TanStack Form y TanStack Query.
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 text-sm px-4 py-2.5 shadow-xs"
        >
          <span>+</span>
          <span>Nueva Categoría</span>
        </Button>
      </div>

      {isError && (
        <ErrorState
          titulo="Error al cargar categorías:"
          error={error}
          onRetry={() => refetch()}
        />
      )}

      {isLoading ? (
        <LoadingState mensaje="Consultando categorías con useQuery y TanStack Table..." />
      ) : categorias.length === 0 ? (
        <EmptyState
          titulo="No hay categorías registradas"
          descripcion="Comienza creando una nueva categoría en el catálogo."
          textoBoton="Nueva Categoría"
          onAccion={handleOpenCreateModal}
        />
      ) : (
        <CategoriaList
          categorias={categorias}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <CategoriaModal
          key={selectedCategoria?.id ?? "nueva-categoria"}
          isOpen={isModalOpen}
          categoriaParaEditar={selectedCategoria}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
