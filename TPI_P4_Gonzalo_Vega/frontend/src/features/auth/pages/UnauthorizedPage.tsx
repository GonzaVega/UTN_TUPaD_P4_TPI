import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto my-16 text-center">
      <Card padding="lg" className="border-rose-200 shadow-md">
        <div className="text-5xl mb-4 select-none">🚫</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Acceso No Autorizado</h2>
        <p className="text-sm text-slate-600 mb-6">
          No tienes permisos para acceder a esta sección. Esta área está restringida exclusivamente a usuarios con rol administrador.
        </p>
        <Link to="/">
          <Button variant="primary" className="w-full">
            Volver al Catálogo
          </Button>
        </Link>
      </Card>
    </div>
  );
};

