import { useEffect } from "react"
import { useAuthStore } from "@/features/auth"
import { AppRouter } from "@/routes/AppRouter"
import { Toast } from "@/shared/components/Toast"

export function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <>
      <AppRouter />
      <Toast />
    </>
  )
}

export default App
