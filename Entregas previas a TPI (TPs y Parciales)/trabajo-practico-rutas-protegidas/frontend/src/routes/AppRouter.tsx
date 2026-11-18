import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import { Navbar } from "@/shared/components/Navbar"
import { UnauthorizedPage } from "@/shared/components/UnauthorizedPage"
import { ProtectedRoute } from "./ProtectedRoute"
import { LoginPage, RegisterPage, AdminUsersPage } from "@/features/auth"
import { CategoriasPage } from "@/features/categories"
import { ProductsPage } from "@/features/products"
import { IngredientesPage } from "@/features/ingredients"

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/categories" replace />} />
          <Route path="/categories" element={<CategoriasPage />} />
          <Route path="/categorias" element={<Navigate to="/categories" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/productos" element={<Navigate to="/products" replace />} />
          <Route path="/ingredients" element={<IngredientesPage />} />
          <Route path="/ingredientes" element={<Navigate to="/ingredients" replace />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/categories" replace />} />
      </Route>
    </Routes>
  )
}

