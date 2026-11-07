import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { UnauthorizedPage } from "../features/auth/pages/UnauthorizedPage";
import { AdminCategoriasPage } from "../features/categorias/pages/AdminCategoriasPage";
import { AdminPedidosPage } from "../features/pedidos/pages/AdminPedidosPage";
import { AdminResumenPage } from "../features/pedidos/pages/AdminResumenPage";
import { CarritoPage } from "../features/pedidos/pages/CarritoPage";
import { CheckoutPage } from "../features/pedidos/pages/CheckoutPage";
import { MisPedidosPage } from "../features/pedidos/pages/MisPedidosPage";
import { AdminProductosPage } from "../features/productos/pages/AdminProductosPage";
import { CatalogoPage } from "../features/productos/pages/CatalogoPage";
import { AdminUsuariosPage } from "../features/usuarios/pages/AdminUsuariosPage";
import { MainLayout } from "../shared/layout/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas con el Layout Principal */}
        <Route element={<MainLayout />}>
          {/* Públicas */}
          <Route path="/" element={<CatalogoPage />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protegidas: Requiere sesión activa (user o admin) */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-pedidos"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <MisPedidosPage />
              </ProtectedRoute>
            }
          />

          {/* Protegidas: Exclusivas para rol admin */}
          <Route
            path="/admin/resumen"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminResumenPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categorias"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminCategoriasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProductosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pedidos"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPedidosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsuariosPage />
              </ProtectedRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

