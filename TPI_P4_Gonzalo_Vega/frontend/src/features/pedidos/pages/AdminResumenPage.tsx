import React from "react";
import { handleApiError } from "../../../shared/api/handleApiError";
import { EstadoError } from "../../../shared/components/EstadoError";
import { Card } from "../../../shared/ui/Card";
import { useResumenPedidos } from "../hooks/usePedidos";

export const AdminResumenPage: React.FC = () => {
  const { data: resumen, isLoading, isError, error, refetch } = useResumenPedidos();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Resumen del Negocio
          </h1>
          <p className="text-sm text-slate-500">Cargando métricas en tiempo real...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <EstadoError
        mensaje={handleApiError(error, "Error al cargar las métricas del negocio")}
        onRetry={() => refetch()}
      />
    );
  }

  const metricas = [
    {
      titulo: "Pedidos Pendientes",
      valor: resumen?.pendientes ?? 0,
      icono: "⏳",
      color: "border-amber-200 bg-amber-50/40 text-amber-900",
      descripcion: "Requieren revisión o pase a cocina",
    },
    {
      titulo: "En Preparación",
      valor: resumen?.en_preparacion ?? 0,
      icono: "👨‍🍳",
      color: "border-blue-200 bg-blue-50/40 text-blue-900",
      descripcion: "Platos siendo elaborados en cocina",
    },
    {
      titulo: "Pedidos Entregados",
      valor: resumen?.entregados ?? 0,
      icono: "✅",
      color: "border-emerald-200 bg-emerald-50/40 text-emerald-900",
      descripcion: "Órdenes completadas con éxito",
    },
    {
      titulo: "Pedidos Cancelados",
      valor: resumen?.cancelados ?? 0,
      icono: "❌",
      color: "border-rose-200 bg-rose-50/40 text-rose-900",
      descripcion: "Cancelaciones con stock restituido",
    },
    {
      titulo: "Pedidos de Hoy",
      valor: resumen?.pedidos_hoy ?? 0,
      icono: "📅",
      color: "border-purple-200 bg-purple-50/40 text-purple-900",
      descripcion: "Total de órdenes registradas en la jornada",
    },
    {
      titulo: "Ingresos Entregados",
      valor: `$${(resumen?.ingresos_entregados ?? 0).toFixed(2)}`,
      icono: "💰",
      color: "border-amber-300 bg-amber-100/50 text-amber-950 font-black",
      descripcion: "Facturación total de órdenes entregadas",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Panel de Control & Indicadores
        </h1>
        <p className="text-sm text-slate-500">
          Métricas consolidadas de ventas, estados transaccionales y facturación
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricas.map((m, idx) => (
          <Card
            key={idx}
            padding="lg"
            className={`border ${m.color} rounded-2xl shadow-xs transition-all hover:shadow-md flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {m.titulo}
              </span>
              <span className="text-3xl select-none">{m.icono}</span>
            </div>

            <div className="my-4">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {m.valor}
              </span>
            </div>

            <p className="text-xs text-slate-500">{m.descripcion}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

