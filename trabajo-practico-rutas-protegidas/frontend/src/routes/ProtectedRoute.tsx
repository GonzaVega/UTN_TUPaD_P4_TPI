import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/features/auth"
import { LoadingState } from "@/shared/components/LoadingState"

interface ProtectedRouteProps {
  allowedRoles?: string[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, checking } = useAuthStore()

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingState mensaje="Verificando sesión..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.some((role) => user.roles.includes(role))) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

