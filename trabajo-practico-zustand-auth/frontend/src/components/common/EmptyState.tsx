import { Button } from "./Button";

interface EmptyStateProps {
  titulo: string;
  descripcion: string;
  textoBoton?: string;
  onAccion?: () => void;
}

export function EmptyState({
  titulo,
  descripcion,
  textoBoton,
  onAccion,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-12 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400 text-xl font-bold">
        ∅
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{titulo}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">{descripcion}</p>
      {textoBoton && onAccion && (
        <Button
          variant="primary"
          onClick={onAccion}
          className="text-xs py-2 px-3.5"
        >
          + {textoBoton}
        </Button>
      )}
    </div>
  );
}
