import { useState, useEffect } from "react";
import type { Producto, ProductoFormData } from "../types/producto";
import type { UnidadMedida } from "../types/unidadMedida";

export interface ProductoModalProps {
  isOpen: boolean;
  productoParaEditar: Producto | null;
  unidades: UnidadMedida[];
  onClose: () => void;
  onSubmit: (formData: ProductoFormData) => Promise<void>;
}

export function ProductoModal({
  isOpen,
  productoParaEditar,
  unidades,
  onClose,
  onSubmit,
}: ProductoModalProps) {
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [precioBase, setPrecioBase] = useState<string>("");
  const [stockCantidad, setStockCantidad] = useState<string>("0");
  const [unidadVentaId, setUnidadVentaId] = useState<number>(1);
  const [disponible, setDisponible] = useState<boolean>(true);

  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<boolean>(false);

  useEffect(() => {
    if (productoParaEditar) {
      setNombre(productoParaEditar.nombre);
      setDescripcion(productoParaEditar.descripcion || "");
      setPrecioBase(productoParaEditar.precio_base.toString());
      setStockCantidad(productoParaEditar.stock_cantidad.toString());
      setUnidadVentaId(productoParaEditar.unidad_venta_id);
      setDisponible(productoParaEditar.disponible);
    } else {
      setNombre("");
      setDescripcion("");
      setPrecioBase("");
      setStockCantidad("0");
      setUnidadVentaId(unidades.length > 0 ? unidades[0].id : 1);
      setDisponible(true);
    }
    setErrorValidacion(null);
  }, [productoParaEditar, isOpen, unidades]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nombreLimpio = nombre.trim();
    if (nombreLimpio.length < 3) {
      setErrorValidacion("El nombre del producto debe tener al menos 3 caracteres.");
      return;
    }

    const precio = parseFloat(precioBase);
    if (isNaN(precio) || precio < 0) {
      setErrorValidacion("El precio base debe ser un número mayor o igual a 0.");
      return;
    }

    const stock = parseFloat(stockCantidad);
    if (isNaN(stock) || stock < 0) {
      setErrorValidacion("El stock debe ser un número mayor o igual a 0.");
      return;
    }

    const unidadSeleccionada = unidades.find((u) => u.id === Number(unidadVentaId));
    if (unidadSeleccionada && unidadSeleccionada.tipo === "contable" && stock % 1 !== 0) {
      setErrorValidacion(
        `La unidad de venta '${unidadSeleccionada.nombre}' es de tipo contable: el stock debe ser un número entero.`
      );
      return;
    }

    try {
      setEnviando(true);
      setErrorValidacion(null);

      await onSubmit({
        nombre: nombreLimpio,
        descripcion: descripcion.trim() || null,
        precio_base: precio,
        unidad_venta_id: Number(unidadVentaId),
        stock_cantidad: stock,
        disponible,
      });

      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorValidacion(err.message);
      } else {
        setErrorValidacion("Ocurrió un error al guardar el producto.");
      }
    } finally {
      setEnviando(false);
    }
  };

  const esEdicion = Boolean(productoParaEditar);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {esEdicion ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {errorValidacion && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {errorValidacion}
            </div>
          )}

          <div>
            <label
              htmlFor="nombre"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
            >
              Nombre del producto *
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              minLength={3}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Milanesa de Ternera, Empanadas Salteñas..."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="descripcion"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción breve del producto..."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="precio_base"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
              >
                Precio base ($) *
              </label>
              <input
                id="precio_base"
                name="precio_base"
                type="number"
                step="0.01"
                min="0"
                required
                value={precioBase}
                onChange={(e) => setPrecioBase(e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="unidad_venta_id"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
              >
                Unidad de venta *
              </label>
              <select
                id="unidad_venta_id"
                name="unidad_venta_id"
                value={unidadVentaId}
                onChange={(e) => setUnidadVentaId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors bg-white cursor-pointer"
              >
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} ({u.simbolo})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label
                htmlFor="stock_cantidad"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
              >
                Stock ({unidades.find((u) => u.id === Number(unidadVentaId))?.simbolo || "u"}) *
              </label>
              <input
                id="stock_cantidad"
                name="stock_cantidad"
                type="number"
                step="any"
                min="0"
                required
                value={stockCantidad}
                onChange={(e) => setStockCantidad(e.target.value)}
                placeholder="0"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
              />
            </div>

            <div className="pt-5">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={disponible}
                  onChange={(e) => setDisponible(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-700">
                  Disponible para la venta
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={enviando}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {enviando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
