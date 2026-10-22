import type { Table } from "@tanstack/react-table";

interface PaginationProps<T> {
  table: Table<T>;
}

export function Pagination<T>({ table }: PaginationProps<T>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
      <div className="flex items-center space-x-2">
        <span>Mostrando</span>
        <span className="font-semibold text-slate-900">
          {totalRows === 0 ? 0 : pageIndex * pageSize + 1} -{" "}
          {Math.min((pageIndex + 1) * pageSize, totalRows)}
        </span>
        <span>de</span>
        <span className="font-semibold text-slate-900">{totalRows}</span>
        <span>registros</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5">
          <span>Filas por pág:</span>
          <select
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border border-slate-300 rounded px-2 py-1 bg-white text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2.5 py-1 rounded border border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Página anterior"
          >
            ← Anterior
          </button>
          <span className="px-2 font-medium text-slate-700">
            {pageCount === 0 ? 0 : pageIndex + 1} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2.5 py-1 rounded border border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Página siguiente"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
