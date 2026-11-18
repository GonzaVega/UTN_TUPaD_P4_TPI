import { useState, useEffect } from "react";
import type { Categoria, CategoriaFormData } from "./types/categoria";
import { Navbar } from "./components/Navbar";
import { CategoriaList } from "./components/CategoriaList";
import { CategoriaModal } from "./components/CategoriaModal";

const API_BASE_URL = "http://localhost:8000";

export function App() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/categorias/`);
      if (!res.ok) {
        throw new Error(
          `Error ${res.status}: No se pudo cargar el listado de categorías.`,
        );
      }
      const data: Categoria[] = await res.json();
      setCategorias(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error de conexión al obtener categorías.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData: CategoriaFormData) => {
    const res = await fetch(`${API_BASE_URL}/categorias/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      throw new Error(
        errorJson?.detail || "No se pudo registrar la categoría.",
      );
    }

    const nueva: Categoria = await res.json();
    setCategorias((prev) => [...prev, nueva]);
  };

  const handleUpdate = async (formData: CategoriaFormData) => {
    if (!selectedCategoria) return;

    const res = await fetch(
      `${API_BASE_URL}/categorias/${selectedCategoria.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      throw new Error(
        errorJson?.detail || "No se pudo actualizar la categoría.",
      );
    }

    const actualizada: Categoria = await res.json();
    setCategorias((prev) =>
      prev.map((cat) => (cat.id === actualizada.id ? actualizada : cat)),
    );
  };

  const handleDelete = async (id: number) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar esta categoría?",
    );
    if (!confirmacion) return;

    try {
      const res = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(
          errorJson?.detail || "No se pudo eliminar la categoría.",
        );
      }

      setCategorias((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err: unknown) {
      alert(
        err instanceof Error ? err.message : "Error al eliminar categoría.",
      );
    }
  };

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
              Categorías
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Administración de categorías del catálogo vinculadas con la base
              de datos.
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

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-sm">Aviso de conexión:</p>
                <p className="text-xs text-amber-700">{error}</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Asegúrate de tener el backend corriendo en{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded">
                    http://localhost:8000
                  </code>
                  .
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={fetchCategorias}
              className="text-xs font-semibold px-3 py-1.5 bg-amber-200 hover:bg-amber-300 rounded-lg text-amber-900 transition-colors cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3" />
            <p className="text-sm font-medium text-slate-600">
              Cargando categorías desde la API...
            </p>
          </div>
        ) : (
          <CategoriaList
            categorias={categorias}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
          />
        )}
      </main>

      <CategoriaModal
        isOpen={isModalOpen}
        categoriaParaEditar={selectedCategoria}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}

export default App;
