interface NavbarProps {
  titulo?: string;
  subtitulo?: string;
}

export const Navbar = ({
  titulo = "TP Productos",
  subtitulo = "Demo: Eventos · Formularios · .map()",
}: NavbarProps) => {
  return (
    <header className="pt-8 pb-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-3xl" role="img" aria-label="caja">
          📦
        </span>
        <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">
          {titulo}
        </h1>
      </div>
      <p className="text-sm text-gray-500 font-medium">
        {subtitulo}
      </p>
    </header>
  );
};
