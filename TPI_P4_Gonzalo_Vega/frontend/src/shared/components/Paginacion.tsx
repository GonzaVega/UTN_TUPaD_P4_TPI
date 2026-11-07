import React from "react";
import { Button } from "../ui/Button";

export interface PaginacionProps {
  pageIndex: number;
  pageSize: number;
  total: number;
  onPageChange: (newPage: number) => void;
}

export const Paginacion: React.FC<PaginacionProps> = ({
  pageIndex,
  pageSize,
  total,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = pageIndex + 1;

  const startItem = total === 0 ? 0 : pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200 sm:px-6">
      <div className="text-xs text-slate-500">
        Mostrando <span className="font-semibold text-slate-700">{startItem}</span> a{" "}
        <span className="font-semibold text-slate-700">{endItem}</span> de{" "}
        <span className="font-semibold text-slate-700">{total}</span> resultados
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={pageIndex <= 0}
          onClick={() => onPageChange(pageIndex - 1)}
        >
          Anterior
        </Button>

        <span className="text-xs font-medium text-slate-600 px-2">
          Página {currentPage} de {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(pageIndex + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

