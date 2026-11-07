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
import { useCategorias } from "../../categorias/hooks/useCategorias";
import {
  useCreateProducto,
  useDeleteProducto,
  useProductos,
  useUpdateProducto,
  useUpdateStockProducto,
} from "../hooks/useProductos";
import type { Producto } from "../types";

const columnHelper = createColumnHelper<Producto>();

export const AdminProductosPage: React.FC = () => {
  // Pide limit=100 según consigna
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useProductos({ limit: 100 });
  const productos = responseData?.items ?? [];

  const { data: categorias = [] } = useCategorias();

  const createMutation = useCreateProducto();
  const updateMutation = useUpdateProducto();
  const updateStockMutation = useUpdateStockProducto();
  const deleteMutation = useDeleteProducto();

  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [productoParaEditar, setProductoParaEditar] = useState<Producto | null>(null);

  const [modalStockOpen, setModalStockOpen] = useState(false);
  const [productoParaStock, setProductoParaStock] = useState<Producto | null>(null);

  const [errorModal, setErrorModal] = useState<string | null>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "# ID",
        cell: (info) => (
          <span className="font-semibold text-slate-400">#{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("nombre", {
        header: "Producto",
        cell: (info) => {
          const prod = info.row.original;
          return (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 flex items-center justify-center">
                {prod.imagen_url ? (
                  <img
                    src={prod.imagen_url}
                    alt={prod.nombre}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-lg">🍽️</span>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900 leading-tight">{info.getValue()}</p>
                <p className="text-xs text-slate-400">
                  {prod.categoria?.nombre ?? "Sin categoría"}
                </p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("precio_base", {
        header: "Precio Base",
        cell: (info) => (
          <span className="font-black text-slate-900">
            ${Number(info.getValue()).toFixed(2)}
          </span>
        ),
      }),
      columnHelper.accessor("stock", {
        header: "Stock",
        cell: (info) => {
          const val = info.getValue();
          return (
            <span
              className={`font-bold text-xs px-2 py-0.5 rounded ${
                val > 0
                  ? "bg-slate-100 text-slate-800"
                  : "bg-rose-100 text-rose-800 font-extrabold"
              }`}
            >
              {val} u.
            </span>
          );
        },
      }),
      columnHelper.accessor("disponible", {
        header: "Disponibilidad",
        cell: (info) => {
          const disp = info.getValue();
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                disp
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {disp ? "Disponible" : "No disponible"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "acciones",
        header: () => <div className="text-right">Acciones</div>,
        cell: (info) => {
          const prod = info.row.original;
          return (
            <div className="flex items-center justify-end space-x-1.5">
              <button
                type="button"
                onClick={() => {
                  setProductoParaStock(prod);
                  setErrorModal(null);
                  setModalStockOpen(true);
                }}
                className="text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 font-semibold px-2 py-1 rounded text-xs transition-colors cursor-pointer"
                title="Modificar stock y disponibilidad"
              >
                Stock
              </button>
              <button
                type="button"
                onClick={() => {
                  setProductoParaEditar(prod);
                  setErrorModal(null);
                  setModalProductoOpen(true);
                }}
                className="text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 font-semibold px-2 py-1 rounded text-xs transition-colors cursor-pointer"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => handleEliminar(prod.id, prod.nombre)}
                className="text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 font-semibold px-2 py-1 rounded text-xs transition-colors cursor-pointer"
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
    data: productos,
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

  const handleEliminar = async (id: number, nombre: string) => {
    if (confirm(`¿Dar de baja lógica el producto "${nombre}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        alert(handleApiError(err, "Error al eliminar producto"));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Gestión de Productos
          </h1>
          <p className="text-sm text-slate-500">
            Administra el catálogo de platos, precios, categorías y stock
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setProductoParaEditar(null);
            setErrorModal(null);
            setModalProductoOpen(true);
          }}
        >
          + Nuevo Producto
        </Button>
      </div>

      {isLoading && <TableSkeleton rows={6} cols={6} />}

      {isError && (
        <EstadoError
          mensaje={handleApiError(error, "No se pudieron cargar los productos")}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && productos.length === 0 && (
        <EstadoVacio
          titulo="No hay productos cargados"
          descripcion="Agrega el primer producto al catálogo."
          textoAccion="+ Crear Producto"
          onAccion={() => {
            setProductoParaEditar(null);
            setErrorModal(null);
            setModalProductoOpen(true);
          }}
        />
      )}

      {!isLoading && !isError && productos.length > 0 && (
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
            total={productos.length}
            onPageChange={(newPage) => table.setPageIndex(newPage)}
          />
        </div>
      )}

      {/* Modal Crear / Editar Producto */}
      <Modal
        isOpen={modalProductoOpen}
        onClose={() => setModalProductoOpen(false)}
        title={productoParaEditar ? "Editar Producto" : "Nuevo Producto"}
        maxWidth="lg"
      >
        <ProductoFormModal
          key={productoParaEditar?.id || "nuevo"}
          producto={productoParaEditar}
          categorias={categorias}
          errorServidor={errorModal}
          onClose={() => setModalProductoOpen(false)}
          onSubmit={async (values) => {
            setErrorModal(null);
            try {
              if (productoParaEditar) {
                await updateMutation.mutateAsync({
                  id: productoParaEditar.id,
                  payload: values,
                });
              } else {
                await createMutation.mutateAsync(values);
              }
              setModalProductoOpen(false);
            } catch (err) {
              setErrorModal(handleApiError(err, "Error al guardar producto"));
            }
          }}
        />
      </Modal>

      {/* Modal Stock y Disponibilidad */}
      <Modal
        isOpen={modalStockOpen}
        onClose={() => setModalStockOpen(false)}
        title={`Actualizar Stock — ${productoParaStock?.nombre ?? ""}`}
      >
        {productoParaStock && (
          <StockFormModal
            key={productoParaStock.id}
            producto={productoParaStock}
            errorServidor={errorModal}
            onClose={() => setModalStockOpen(false)}
            onSubmit={async (values) => {
              setErrorModal(null);
              try {
                await updateStockMutation.mutateAsync({
                  id: productoParaStock.id,
                  payload: values,
                });
                setModalStockOpen(false);
              } catch (err) {
                setErrorModal(handleApiError(err, "Error al actualizar stock"));
              }
            }}
          />
        )}
      </Modal>
    </div>
  );
};

// Formulario completo de producto con TanStack Form
interface ProductoFormModalProps {
  producto: Producto | null;
  categorias: Array<{ id: number; nombre: string }>;
  errorServidor: string | null;
  onClose: () => void;
  onSubmit: (values: {
    nombre: string;
    descripcion: string;
    precio_base: number;
    imagen_url: string;
    stock: number;
    disponible: boolean;
    categoria_id: number;
  }) => Promise<void>;
}

const ProductoFormModal: React.FC<ProductoFormModalProps> = ({
  producto,
  categorias,
  errorServidor,
  onClose,
  onSubmit,
}) => {
  const defaultCategoriaId = producto?.categoria_id || (categorias[0]?.id ?? 0);

  const form = useForm({
    defaultValues: {
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      precio_base: producto?.precio_base ?? 0,
      imagen_url: producto?.imagen_url ?? "",
      stock: producto?.stock ?? 10,
      disponible: producto?.disponible ?? true,
      categoria_id: defaultCategoriaId,
    },
    validators: {
      onSubmit: ({ value }) => {
        const errors: Record<string, string> = {};
        if (!value.nombre.trim()) {
          errors.nombre = "El nombre es obligatorio";
        }
        if (value.precio_base < 0) {
          errors.precio_base = "El precio debe ser mayor o igual a 0";
        }
        if (value.stock < 0) {
          errors.stock = "El stock debe ser mayor o igual a 0";
        }
        if (!value.categoria_id) {
          errors.categoria_id = "Debe seleccionar una categoría";
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
        precio_base: Number(value.precio_base),
        imagen_url: value.imagen_url.trim(),
        stock: Number(value.stock),
        disponible: Boolean(value.disponible),
        categoria_id: Number(value.categoria_id),
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

      {/* Nombre */}
      <form.Field name="nombre">
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nombre del producto *
            </label>
            <input
              id={field.name}
              name={field.name}
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 transition-colors"
            />
            {field.state.meta.errors.map((err) => (
              <p key={String(err)} className="text-xs text-rose-600 mt-1">{String(err)}</p>
            ))}
          </div>
        )}
      </form.Field>

      {/* Categoría */}
      <form.Field name="categoria_id">
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Categoría *
            </label>
            <select
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 transition-colors"
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {field.state.meta.errors.map((err) => (
              <p key={String(err)} className="text-xs text-rose-600 mt-1">{String(err)}</p>
            ))}
          </div>
        )}
      </form.Field>

      {/* Precio y Stock */}
      <div className="grid grid-cols-2 gap-4">
        <form.Field name="precio_base">
          {(field) => (
            <div>
              <label htmlFor={field.name} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Precio Base ($) *
              </label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                step="0.01"
                min="0"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 transition-colors"
              />
              {field.state.meta.errors.map((err) => (
                <p key={String(err)} className="text-xs text-rose-600 mt-1">{String(err)}</p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="stock">
          {(field) => (
            <div>
              <label htmlFor={field.name} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Stock Inicial *
              </label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 transition-colors"
              />
              {field.state.meta.errors.map((err) => (
                <p key={String(err)} className="text-xs text-rose-600 mt-1">{String(err)}</p>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      {/* URL de Imagen */}
      <form.Field name="imagen_url">
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              URL de Imagen
            </label>
            <input
              id={field.name}
              name={field.name}
              type="url"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 transition-colors"
            />
          </div>
        )}
      </form.Field>

      {/* Descripción */}
      <form.Field name="descripcion">
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Descripción
            </label>
            <textarea
              id={field.name}
              name={field.name}
              rows={2}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 transition-colors resize-none"
            />
          </div>
        )}
      </form.Field>

      {/* Checkbox Disponible */}
      <form.Field name="disponible">
        {(field) => (
          <div className="flex items-center space-x-2 pt-1">
            <input
              id={field.name}
              name={field.name}
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor={field.name} className="text-xs font-medium text-slate-700 select-none cursor-pointer">
              Producto disponible para la venta inmediata
            </label>
          </div>
        )}
      </form.Field>

      {/* Botones */}
      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancelar
        </Button>
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              variant="primary"
              disabled={!canSubmit || isSubmitting}
              isLoading={isSubmitting}
            >
              Guardar Producto
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};

// Formulario de Stock y Disponibilidad con TanStack Form
interface StockFormModalProps {
  producto: Producto;
  errorServidor: string | null;
  onClose: () => void;
  onSubmit: (values: { stock: number; disponible: boolean }) => Promise<void>;
}

const StockFormModal: React.FC<StockFormModalProps> = ({
  producto,
  errorServidor,
  onClose,
  onSubmit,
}) => {
  const form = useForm({
    defaultValues: {
      stock: producto.stock,
      disponible: producto.disponible,
    },
    validators: {
      onSubmit: ({ value }) => {
        if (value.stock < 0) {
          return { fields: { stock: "El stock no puede ser negativo" } };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        stock: Number(value.stock),
        disponible: Boolean(value.disponible),
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

      <form.Field name="stock">
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Cantidad en Stock (unidades)
            </label>
            <input
              id={field.name}
              name={field.name}
              type="number"
              min="0"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 transition-colors"
            />
            {field.state.meta.errors.map((err) => (
              <p key={String(err)} className="text-xs text-rose-600 mt-1">{String(err)}</p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Field name="disponible">
        {(field) => (
          <div className="flex items-center space-x-2 pt-2">
            <input
              id={field.name}
              name={field.name}
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor={field.name} className="text-xs font-medium text-slate-700 select-none cursor-pointer">
              Habilitado para la venta en el catálogo
            </label>
          </div>
        )}
      </form.Field>

      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancelar
        </Button>
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              variant="primary"
              disabled={!canSubmit || isSubmitting}
              isLoading={isSubmitting}
            >
              Actualizar Stock
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};

