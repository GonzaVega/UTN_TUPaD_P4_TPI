import { Button } from "./Button"

interface EmptyStateProps {
  titulo: string
  descripcion: string
  textoBoton?: string
  textoAccion?: string
  onAccion?: () => void
  onAction?: () => void
}

export function EmptyState({
  titulo,
  descripcion,
  textoBoton,
  textoAccion,
  onAccion,
  onAction,
}: EmptyStateProps) {
  const accion = onAccion || onAction
  const texto = textoBoton || textoAccion

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 p-12 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-400 dark:text-slate-500 text-xl font-bold">
        ∅
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">{titulo}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">{descripcion}</p>
      {texto && accion && (
        <Button
          variant="primary"
          onClick={accion}
          className="text-xs py-2 px-3.5"
        >
          + {texto}
        </Button>
      )}
    </div>
  )
}
