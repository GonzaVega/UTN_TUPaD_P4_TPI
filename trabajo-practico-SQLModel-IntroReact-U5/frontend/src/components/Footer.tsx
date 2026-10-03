interface FooterProps {
  carrera?: string;
  materia?: string;
  autor?: string;
}

export const Footer = ({
  carrera = "Tecnicatura Universitaria en Programación a Distancia",
  materia = "Programación IV · TP Integrador Unidad 5",
  autor = "UTN - Facultad Regional",
}: FooterProps) => {
  return (
    <footer className="py-8 text-center text-xs text-gray-400 border-t border-gray-100 max-w-xl mx-auto">
      <p className="font-medium text-gray-500">{materia}</p>
      <p className="mt-1">{carrera} — {autor}</p>
    </footer>
  );
};
