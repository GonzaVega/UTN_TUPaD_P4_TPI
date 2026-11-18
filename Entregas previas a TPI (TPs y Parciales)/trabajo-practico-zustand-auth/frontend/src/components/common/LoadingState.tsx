interface LoadingStateProps {
  mensaje?: string;
  variant?: "spinner" | "skeleton";
}

export function LoadingState({
  mensaje = "Cargando información del servidor...",
  variant = "spinner",
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className="space-y-3" aria-busy="true">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-16 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl shadow-xs border border-slate-200 p-12 text-center"
      aria-busy="true"
    >
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand border-t-transparent mb-3" />
      <p className="text-sm font-medium text-slate-600">{mensaje}</p>
    </div>
  );
}
