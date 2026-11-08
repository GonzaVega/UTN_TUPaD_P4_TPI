import type { Producto } from "../types/producto"
import { ProductoCard } from "./ProductoCard"

interface ProductoDetailModalProps {
  producto: Producto | null
  onClose: () => void
}

export function ProductoDetailModal({
  producto,
  onClose,
}: ProductoDetailModalProps) {
  if (!producto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-sm w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Vista Previa de Tarjeta
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg p-1 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <ProductoCard producto={producto} />
        </div>
      </div>
    </div>
  )
}

