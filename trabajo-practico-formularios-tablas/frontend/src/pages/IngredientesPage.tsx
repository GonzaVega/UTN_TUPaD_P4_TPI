import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Ingrediente, IngredienteFormData } from "../types/ingrediente";
import {
  createIngrediente,
  deleteIngrediente,
  getIngredientes,
  updateIngrediente,
} from "../services/ingredienteService";
import { IngredienteTable } from "../components/IngredienteTable";
import { IngredienteModal } from "../components/IngredienteModal";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { Button } from "../components/common/Button";

export function IngredientesPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIngrediente, setSelectedIngrediente] =
    useState<Ingrediente | null>(null);

  const {
    data: ingredientes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Ingrediente[]>({
    queryKey: ["ingredientes"],
    queryFn: getIngredientes,
  });

  const createMutation = useMutation({
    mutationFn: createIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
    },
    onError: (err: unknown) => {
      alert(
        err instanceof Error ? err.message : "Error al eliminar el ingrediente.",
      );
    },
  });

  const handleOpenCreateModal = () => {
    setSelectedIngrediente(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ingrediente: Ingrediente) => {
    setSelectedIngrediente(ingrediente);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIngrediente(null);
  };

  const handleModalSubmit = async (formData: IngredienteFormData) => {
    if (selectedIngrediente) {
      await updateMutation.mutateAsync({
        id: selectedIngrediente.id,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleDelete = (id: number) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar este ingrediente?",
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
            Ingredientes
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gestión completa de ingredientes con TanStack Table v8, TanStack Form y TanStack Query.
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 text-sm px-4 py-2.5 shadow-xs"
        >
          <span>+</span>
          <span>Nuevo Ingrediente</span>
        </Button>
      </div>

      {isError && (
        <ErrorState
          titulo="Error al cargar ingredientes:"
          error={error}
          onRetry={() => refetch()}
        />
      )}

      {isLoading ? (
        <LoadingState mensaje="Consultando ingredientes con useQuery y TanStack Table..." />
      ) : ingredientes.length === 0 ? (
        <EmptyState
          titulo="No hay ingredientes registrados"
          descripcion="Comienza creando un nuevo ingrediente."
          textoBoton="Nuevo Ingrediente"
          onAccion={handleOpenCreateModal}
        />
      ) : (
        <IngredienteTable
          data={ingredientes}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <IngredienteModal
          key={selectedIngrediente?.id ?? "nuevo-ingrediente"}
          isOpen={isModalOpen}
          ingredienteParaEditar={selectedIngrediente}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
