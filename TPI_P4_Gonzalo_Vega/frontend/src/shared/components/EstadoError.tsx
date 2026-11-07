import React from "react";
import { Button } from "../ui/Button";

export interface EstadoErrorProps {
  mensaje: string;
  onRetry?: () => void;
}

export const EstadoError: React.FC<EstadoErrorProps> = ({
  mensaje,
  onRetry,
}) => {
  return (
    <div
      role="alert"
      className="p-6 my-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-start space-x-3">
        <span className="text-xl">⚠️</span>
        <div>
          <h4 className="text-sm font-semibold text-rose-800">
            Error al procesar la solicitud
          </h4>
          <p className="text-xs text-rose-600 mt-0.5">{mensaje}</p>
        </div>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="text-rose-700 border-rose-300 hover:bg-rose-100">
          Reintentar
        </Button>
      )}
    </div>
  );
};

