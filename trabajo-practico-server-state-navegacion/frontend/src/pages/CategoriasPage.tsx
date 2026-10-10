import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Categoria, CategoriaFormData } from "../types/categoria";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categoriaService";
import { CategoriaList } from "../components/CategoriaList";
import { CategoriaModal } from "../components/CategoriaModal";

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
            Administración del catálogo sincronizada con el backend mediante
            TanStack Query.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <span>+</span>
          <span>Añadir Categoría</span>
        </button>
      </div>

      {isError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-sm">
                Error al cargar categorías:
              </p>
              <p className="text-xs text-amber-700">
                {error instanceof Error ? error.message : "Error desconocido"}
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Verifica que la API FastAPI esté ejecutándose en{" "}
                <code className="bg-amber-100 px-1 py-0.5 rounded">
                  http://localhost:8000
                </code>
                .
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs font-semibold px-3 py-1.5 bg-amber-200 hover:bg-amber-300 rounded-lg text-amber-900 transition-colors cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3" />
          <p className="text-sm font-medium text-slate-600">
            Consultando categorías con useQuery...
          </p>
        </div>
      ) : (
        <CategoriaList
          categorias={categorias}
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
  );
}
