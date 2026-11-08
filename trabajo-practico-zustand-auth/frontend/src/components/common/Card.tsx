import type { ReactNode } from "react";

export interface CardProps {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, actions, children, className = "" }: CardProps) {
  return (
    <article
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-xs ${className}`}
    >
      {title && (
        <h3 className="mb-2 text-lg font-semibold text-slate-800">{title}</h3>
      )}
      {children}
      {actions && (
        <div className="mt-4 flex justify-end gap-2">{actions}</div>
      )}
    </article>
  );
}
