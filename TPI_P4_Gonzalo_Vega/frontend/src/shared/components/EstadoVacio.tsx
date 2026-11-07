import React from "react";
import { Button } from "../ui/Button";

export interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
  icono?: string;
  textoAccion?: string;
  onAccion?: () => void;
}

export const EstadoVacio: React.FC<EstadoVacioProps> = ({
  titulo,
  descripcion,
  icono = "🍽️",
  textoAccion,
  onAccion,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs my-6">
      <div className="text-5xl mb-4 select-none">{icono}</div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{titulo}</h3>
      {descripcion && (
        <p className="text-sm text-slate-500 max-w-sm mb-6">{descripcion}</p>
      )}
      {textoAccion && onAccion && (
        <Button variant="primary" onClick={onAccion}>
          {textoAccion}
        </Button>
      )}
    </div>
  );
};

