import { useQuery } from "@tanstack/react-query";
import type { Producto } from "../types/producto";
import { getProductos } from "../services/productoService";
import { ProductoCard } from "../components/ProductoCard";

export function ProductsPage() {
  // Lectura del Server State de Productos con useQuery
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

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Catálogo de Productos
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Visualización de productos y sus categorías asociadas mediante TanStack Query.
          </p>
        </div>

        <div className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-xs">
          Total de productos: <span className="font-bold text-slate-800">{productos.length}</span>
        </div>
      </div>

      {/* Alerta de Error en useQuery */}
      {isError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-sm">Error al cargar productos:</p>
              <p className="text-xs text-amber-700">
                {error instanceof Error ? error.message : "Error desconocido"}
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Asegúrate de que el backend FastAPI esté corriendo en{" "}
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

      {/* Estado de Carga */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3" />
          <p className="text-sm font-medium text-slate-600">
            Consultando catálogo con useQuery...
          </p>
        </div>
      ) : productos.length === 0 ? (
        /* Estado Vacío */
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-12 text-center">
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            No hay productos registrados
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            El catálogo se encuentra vacío en el backend. Puedes consultar la API o inicializar el seed.
          </p>
        </div>
      ) : (
        /* Cuadrícula de Productos */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}
