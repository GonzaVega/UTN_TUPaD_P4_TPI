import React, { useState } from "react";
import { EstadoError } from "../../../shared/components/EstadoError";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";
import { Paginacion } from "../../../shared/components/Paginacion";
import { ProductoCardSkeleton } from "../../../shared/components/Skeleton";
import { useCategorias } from "../../categorias/hooks/useCategorias";
import { ProductoCard } from "../components/ProductoCard";
import { useProductos } from "../hooks/useProductos";

const PAGE_SIZE = 8;

export const CatalogoPage: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | undefined>(undefined);

  // Consulta de categorías activas para los filtros
  const { data: categorias = [] } = useCategorias();

  // Consulta de productos paginados en servidor
  const {
    data: productosData,
    isLoading,
    isError,
    error,
    refetch,
  } = useProductos({
    skip: pageIndex * PAGE_SIZE,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    categoria_id: categoriaSeleccionada,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setPageIndex(0);
    setDebouncedSearch(val.trim());
  };

  const handleCategoriaClick = (catId?: number) => {
    setCategoriaSeleccionada(catId);
    setPageIndex(0);
  };

  const totalProductos = productosData?.total ?? 0;
  const productos = productosData?.items ?? [];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-3xl p-8 sm:p-12 text-white shadow-md relative overflow-hidden">
        <div className="max-w-xl relative z-10">
          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block mb-3">
            Comida Casera y Rápida
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Sabores auténticos directo a tu mesa
          </h1>
          <p className="mt-3 text-amber-100 text-sm sm:text-base">
            Pizzas a la piedra, hamburguesas gourmet, bebidas frescas y postres artesanales. Elige tus favoritos y recíbelos en minutos.
          </p>
        </div>
        <div className="absolute right-4 -bottom-6 text-9xl opacity-20 hidden md:block select-none">
          🍔🍕
        </div>
      </div>

      {/* Controles: Búsqueda y Filtros de Categorías */}
      <div className="space-y-4">
        {/* Barra de Búsqueda */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre (ej. Margarita, Burger, IPA...)"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 transition-colors shadow-xs"
          />
          <span className="absolute left-3.5 top-3 text-slate-400 select-none">
            🔍
          </span>
        </div>

        {/* Chips de Categorías */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleCategoriaClick(undefined)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              categoriaSeleccionada === undefined
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            Todas las categorías
          </button>

          {categorias.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoriaClick(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoriaSeleccionada === cat.id
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido Principal */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <ProductoCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <EstadoError
          mensaje={error instanceof Error ? error.message : "Error al cargar el catálogo de productos"}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && productos.length === 0 && (
        <EstadoVacio
          titulo="No se encontraron productos"
          descripcion={
            searchTerm || categoriaSeleccionada
              ? "Prueba modificando los filtros o el término de búsqueda."
              : "Aún no hay productos disponibles en el catálogo."
          }
          textoAccion={searchTerm || categoriaSeleccionada ? "Limpiar filtros" : undefined}
          onAccion={() => {
            setSearchTerm("");
            setDebouncedSearch("");
            setCategoriaSeleccionada(undefined);
          }}
        />
      )}

      {!isLoading && !isError && productos.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((prod) => (
              <ProductoCard key={prod.id} producto={prod} />
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <Paginacion
              pageIndex={pageIndex}
              pageSize={PAGE_SIZE}
              total={totalProductos}
              onPageChange={(nuevaPag) => setPageIndex(nuevaPag)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

