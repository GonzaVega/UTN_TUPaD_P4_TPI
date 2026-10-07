export function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
            UTN
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Gestor de Categorías
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Programación IV — TP6 Integrador React & FastAPI
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-sm">
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-blue-600 font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50/50 transition-colors"
          >
            Swagger API Docs ↗
          </a>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            Full Stack
          </span>
        </div>
      </div>
    </header>
  );
}
