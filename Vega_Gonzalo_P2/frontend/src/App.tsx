import { useState, useEffect } from "react";
import type { Producto, ProductoFormData } from "./types/producto";
import type { UnidadMedida } from "./types/unidadMedida";
import { Navbar } from "./components/Navbar";
import { ProductoList } from "./components/ProductoList";
import { ProductoModal } from "./components/ProductoModal";

const API_BASE_URL = "http://localhost:8000/api/v1";

export function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [unidades, setUnidades] = useState<UnidadMedida[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      setError(null);

      const [resProductos, resUnidades] = await Promise.all([
        fetch(`${API_BASE_URL}/productos?limit=50`),
        fetch(`${API_BASE_URL}/unidades-medida`),
      ]);

      if (!resProductos.ok) {
        throw new Error(
          `Error ${resProductos.status}: No se pudo cargar el catálogo de productos.`
        );
      }
      if (!resUnidades.ok) {
        throw new Error(
          `Error ${resUnidades.status}: No se pudo cargar el catálogo de unidades de medida.`
        );
      }

      const dataProductos: Producto[] = await resProductos.json();
      const dataUnidades: UnidadMedida[] = await resUnidades.json();

      setProductos(dataProductos);
      setUnidades(dataUnidades);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error de conexión al cargar datos iniciales del catálogo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData: ProductoFormData) => {
    const res = await fetch(`${API_BASE_URL}/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      throw new Error(errorJson?.detail || "No se pudo registrar el producto.");
    }

    const nuevoProducto: Producto = await res.json();
    setProductos((prev) => [nuevoProducto, ...prev]);
  };

  const handleUpdate = async (formData: ProductoFormData) => {
    if (!productoSeleccionado) return;

    const res = await fetch(`${API_BASE_URL}/productos/${productoSeleccionado.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      throw new Error(errorJson?.detail || "No se pudo actualizar el producto.");
    }

    const productoActualizado: Producto = await res.json();
    setProductos((prev) =>
      prev.map((p) => (p.id === productoActualizado.id ? productoActualizado : p))
    );
  };

  const handleToggleDisponibilidad = async (producto: Producto) => {
    try {
      const payload: ProductoFormData = {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio_base: producto.precio_base,
        unidad_venta_id: producto.unidad_venta_id,
        stock_cantidad: producto.stock_cantidad,
        disponible: !producto.disponible,
      };

      const res = await fetch(`${API_BASE_URL}/productos/${producto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(errorJson?.detail || "No se pudo modificar la disponibilidad.");
      }

      const actualizado: Producto = await res.json();
      setProductos((prev) =>
        prev.map((p) => (p.id === actualizado.id ? actualizado : p))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al cambiar disponibilidad.");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas anular este producto del catálogo? (Baja lógica)"
    );
    if (!confirmacion) return;

    try {
      const res = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(errorJson?.detail || "No se pudo anular el producto.");
      }

      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al anular el producto.");
    }
  };

  const handleOpenCreateModal = () => {
    setProductoSeleccionado(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductoSeleccionado(null);
  };

  const handleModalSubmit = async (formData: ProductoFormData) => {
    if (productoSeleccionado) {
      await handleUpdate(formData);
    } else {
      await handleCreate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Productos en Catálogo
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Gestiona los productos, su precio, stock en unidad de venta y disponibilidad.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>+</span>
            <span>Añadir Producto</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-sm">Aviso de conexión:</p>
                <p className="text-xs text-amber-700">{error}</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Asegúrate de que el backend esté ejecutándose en{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">
                    http://localhost:8000
                  </code>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={cargarDatosIniciales}
              className="text-xs font-semibold px-3 py-1.5 bg-amber-200 hover:bg-amber-300 rounded-lg text-amber-900 transition-colors cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3" />
            <p className="text-sm font-medium text-slate-600">
              Cargando catálogo y unidades desde la API...
            </p>
          </div>
        ) : (
          <ProductoList
            productos={productos}
            onEdit={handleOpenEditModal}
            onToggleDisponible={handleToggleDisponibilidad}
            onDelete={handleDelete}
          />
        )}
      </main>

      <ProductoModal
        isOpen={isModalOpen}
        productoParaEditar={productoSeleccionado}
        unidades={unidades}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}

export default App;
