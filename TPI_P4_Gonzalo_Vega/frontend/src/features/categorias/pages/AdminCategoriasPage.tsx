import React, { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useForm } from "@tanstack/react-form";
import { handleApiError } from "../../../shared/api/handleApiError";
import { EstadoError } from "../../../shared/components/EstadoError";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";
import { Paginacion } from "../../../shared/components/Paginacion";
import { TableSkeleton } from "../../../shared/components/Skeleton";
import { Button } from "../../../shared/ui/Button";
import { Modal } from "../../../shared/ui/Modal";
import {
  useCategorias,
  useCreateCategoria,
  useDeleteCategoria,
  useUpdateCategoria,
} from "../hooks/useCategorias";
import type { Categoria } from "../types";

const columnHelper = createColumnHelper<Categoria>();

export const AdminCategoriasPage: React.FC = () => {
  const { data: categorias = [], isLoading, isError, error, refetch } = useCategorias();
  const createMutation = useCreateCategoria();
  const updateMutation = useUpdateCategoria();
  const deleteMutation = useDeleteCategoria();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaParaEditar, setCategoriaParaEditar] = useState<Categoria | null>(null);
  const [errorForm, setErrorForm] = useState<string | null>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "# ID",
        cell: (info) => (
          <span className="font-semibold text-slate-400">#{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("nombre", {
        header: "Nombre de Categoría",
        cell: (info) => (
          <span className="font-bold text-slate-900">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("descripcion", {
        header: "Descripción",
        cell: (info) => (
          <span className="text-slate-600 text-xs">
            {info.getValue() || <span className="text-slate-400 italic">Sin descripción</span>}
          </span>
        ),
      }),
      columnHelper.display({
        id: "acciones",
        header: () => <div className="text-right">Acciones</div>,
        cell: (info) => {
          const cat = info.row.original;
          return (
            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => handleAbrirEditar(cat)}
                className="text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 font-semibold px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => handleEliminar(cat.id, cat.nombre)}
                className="text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 font-semibold px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: categorias,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleAbrirCrear = () => {
    setCategoriaParaEditar(null);
    setErrorForm(null);
    setIsModalOpen(true);
  };

  const handleAbrirEditar = (cat: Categoria) => {
    setCategoriaParaEditar(cat);
    setErrorForm(null);
    setIsModalOpen(true);
  };

  const handleEliminar = async (id: number, nombre: string) => {
    if (confirm(`¿Estás seguro de dar de baja la categoría "${nombre}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        alert(handleApiError(err, "Error al eliminar categoría"));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Gestión de Categorías
          </h1>
          <p className="text-sm text-slate-500">
            Administra las categorías del catálogo gastronómico
          </p>
        </div>

        <Button variant="primary" onClick={handleAbrirCrear}>
          + Nueva Categoría
        </Button>
      </div>

      {isLoading && <TableSkeleton rows={5} cols={4} />}

      {isError && (
        <EstadoError
          mensaje={handleApiError(error, "No se pudieron cargar las categorías")}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && categorias.length === 0 && (
        <EstadoVacio
          titulo="No hay categorías registradas"
          descripcion="Comienza creando la primera categoría para tus productos."
          textoAccion="+ Crear Categoría"
          onAccion={handleAbrirCrear}
        />
      )}

      {!isLoading && !isError && categorias.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider select-none"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Paginacion
            pageIndex={table.getState().pagination.pageIndex}
            pageSize={table.getState().pagination.pageSize}
            total={categorias.length}
            onPageChange={(newPage) => table.setPageIndex(newPage)}
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={categoriaParaEditar ? "Editar Categoría" : "Nueva Categoría"}
      >
        <CategoriaFormModal
          key={categoriaParaEditar?.id || "nueva"}
          categoria={categoriaParaEditar}
          errorServidor={errorForm}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (values) => {
            setErrorForm(null);
            try {
              if (categoriaParaEditar) {
                await updateMutation.mutateAsync({
                  id: categoriaParaEditar.id,
                  payload: values,
                });
              } else {
                await createMutation.mutateAsync(values);
              }
              setIsModalOpen(false);
            } catch (err) {
              setErrorForm(handleApiError(err, "Error al guardar categoría"));
            }
          }}
        />
      </Modal>
    </div>
  );
};

interface CategoriaFormModalProps {
  categoria: Categoria | null;
  errorServidor: string | null;
  onClose: () => void;
  onSubmit: (values: { nombre: string; descripcion: string }) => Promise<void>;
}

const CategoriaFormModal: React.FC<CategoriaFormModalProps> = ({
  categoria,
  errorServidor,
  onClose,
  onSubmit,
}) => {
  const form = useForm({
    defaultValues: {
      nombre: categoria?.nombre ?? "",
      descripcion: categoria?.descripcion ?? "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const errors: Record<string, string> = {};
        if (!value.nombre.trim() || value.nombre.trim().length < 2) {
          errors.nombre = "El nombre debe contener al menos 2 caracteres";
        }
        if (value.nombre.trim().length > 100) {
          errors.nombre = "El nombre no puede superar los 100 caracteres";
        }
        if (Object.keys(errors).length > 0) {
          return { fields: errors };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {errorServidor && (
        <div className="p-3 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-lg">
          {errorServidor}
        </div>
      )}

      <form.Field name="nombre">
        {(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
            >
              Nombre * (2 a 100 caracteres)
            </label>
            <input
              id={field.name}
              name={field.name}
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej: Pizzas, Empanadas, Postres..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 transition-colors"
            />
            {field.state.meta.errors.map((err) => (
              <p key={String(err)} className="text-xs text-rose-600 mt-1">
                {String(err)}
              </p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Field name="descripcion">
        {(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
            >
              Descripción
            </label>
            <textarea
              id={field.name}
              name={field.name}
              rows={3}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Breve descripción para el catálogo..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 transition-colors resize-none"
            />
          </div>
        )}
      </form.Field>

      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancelar
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              variant="primary"
              disabled={!canSubmit || isSubmitting}
              isLoading={isSubmitting}
            >
              Guardar
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};

