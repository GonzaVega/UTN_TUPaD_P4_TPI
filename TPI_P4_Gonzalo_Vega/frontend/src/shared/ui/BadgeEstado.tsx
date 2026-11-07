import React from "react";

export type EstadoPedidoTipo =
  | "PENDIENTE"
  | "EN_PREPARACION"
  | "ENTREGADO"
  | "CANCELADO"
  | string;

export interface BadgeEstadoProps {
  estado: EstadoPedidoTipo;
}

export const BadgeEstado: React.FC<BadgeEstadoProps> = ({ estado }) => {
  const config: Record<
    string,
    { label: string; styles: string }
  > = {
    PENDIENTE: {
      label: "Pendiente",
      styles: "bg-amber-50 text-amber-700 border-amber-200",
    },
    EN_PREPARACION: {
      label: "En Preparación",
      styles: "bg-blue-50 text-blue-700 border-blue-200",
    },
    ENTREGADO: {
      label: "Entregado",
      styles: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    CANCELADO: {
      label: "Cancelado",
      styles: "bg-rose-50 text-rose-700 border-rose-200",
    },
  };

  const item = config[estado] || {
    label: estado,
    styles: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${item.styles}`}
    >
      {item.label}
    </span>
  );
};

