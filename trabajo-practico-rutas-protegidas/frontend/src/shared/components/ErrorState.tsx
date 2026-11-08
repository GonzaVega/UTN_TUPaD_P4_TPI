import { Button } from "./Button";

interface ErrorStateProps {
  titulo?: string;
  error: unknown;
  onRetry?: () => void;
}

export function ErrorState({
  titulo = "No se pudieron cargar los datos del servidor.",
  error,
  onRetry,
}: ErrorStateProps) {
  const mensajeError =
    error instanceof Error ? error.message : "Error de comunicación con el servidor.";

  return (
    <div
      role="alert"
      className="mb-6 p-4 rounded-xl border border-error bg-red-50/50 text-error flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div className="flex items-start sm:items-center space-x-3">
        <span className="text-xl">⚠️</span>
        <div>
          <p className="font-semibold text-sm">{titulo}</p>
          <p className="text-xs text-red-700 mt-0.5">{mensajeError}</p>
          <p className="text-xs text-red-600/80 mt-0.5">
            Verifica que la API FastAPI esté activa en{" "}
            <code className="bg-red-100 px-1 py-0.5 rounded font-mono text-xs">
              http://localhost:8000
            </code>
          </p>
        </div>
      </div>

      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="self-start sm:self-auto text-xs py-1.5 px-3 border-error text-error hover:bg-red-50"
        >
          Reintentar
        </Button>
      )}
    </div>
  );
}
