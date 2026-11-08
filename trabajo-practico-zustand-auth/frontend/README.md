# Frontend - TP9: Estado Global con Zustand y Autenticación

Aplicación frontend desarrollada en **React + TypeScript** para la **Unidad 9 de Programación IV (UTN - TUPaD)**. Consume la API autenticada del Food Store utilizando **Axios con credenciales e interceptores**, mantiene el estado global de sesión con **Zustand (`persist`)** y protege rutas e interfaz según el rol del usuario.

---

## 📂 Estructura de Carpetas

```text
src/
├── api/
│   └── axiosInstance.ts        # Instancia de Axios con withCredentials: true e interceptor 401
├── components/
│   ├── common/                 # Button, Card, EmptyState, ErrorState, LoadingState, Pagination
│   ├── CategoriaModal.tsx
│   ├── CategoriaTable.tsx
│   ├── IngredienteModal.tsx
│   ├── IngredienteTable.tsx
│   ├── Navbar.tsx              # Muestra nombre, apellido, rol y botón «Cerrar sesión»
│   ├── ProductoCard.tsx
│   ├── ProductoDetailModal.tsx
│   ├── ProductoModal.tsx
│   ├── ProductoTable.tsx
│   └── ProtectedRoute.tsx      # Protección por sesión y por allowedRoles
├── pages/
│   ├── LoginPage.tsx           # Formulario de login con TanStack Form
│   ├── RegisterPage.tsx        # Formulario de registro con TanStack Form
│   ├── CategoriesPage.tsx
│   ├── CategoriasPage.tsx      # Listado y ABM de categorías
│   ├── ProductsPage.tsx        # Listado y ABM de productos con sus categorías
│   ├── IngredientesPage.tsx    # Listado y ABM de ingredientes
│   ├── AdminUsersPage.tsx      # Gestión de usuarios (Activar / Desactivar) solo para admin
│   └── UnauthorizedPage.tsx    # Pantalla de acceso denegado (403)
├── services/
│   ├── categoriaService.ts
│   ├── productoService.ts
│   └── ingredienteService.ts
├── store/
│   └── authStore.ts            # useAuthStore con Zustand y middleware persist (sin guardar token)
├── types/
│   ├── auth.types.ts           # UsuarioAuth, LoginFormData, RegisterFormData
│   ├── categoria.ts
│   ├── producto.ts
│   └── ingrediente.ts
└── App.tsx                     # Confirmación de sesión con checkSession() y definición de rutas
```

---

## 🚀 Comportamiento Implementado

1. **Instancia e Interceptores de Axios (`src/api/axiosInstance.ts`):**
   - Configurada con `baseURL: "http://localhost:8000/api/v1"` y `withCredentials: true` para enviar automáticamente la cookie HttpOnly `access_token`.
   - El interceptor de respuesta detecta respuestas `401` (salvo en `/auth/token` y `/auth/me`) y limpia el `AuthStore` redirigiendo al login.

2. **Estado Global de Sesión (`src/store/authStore.ts`):**
   - Exporta `useAuthStore` con `user: UsuarioAuth | null`, `isLoading: boolean` y las acciones `login(email, password)`, `logout()`, `checkSession()` y `clearSession()`.
   - Utiliza el middleware `persist` con `partialize` para conservar únicamente los datos públicos del usuario (`user`) en almacenamiento local, sin leer ni guardar nunca el token JWT.
   - Al recargar la aplicación, `App.tsx` ejecuta `checkSession()` contra `GET /auth/me`.

3. **Rutas Protegidas y Renderizado Condicional por Rol:**
   - `/login`, `/register` y `/unauthorized` son rutas públicas.
   - `/categories`, `/products` e `/ingredients` requieren sesión activa (`user` o `admin`).
   - `/admin/users` requiere el rol `admin`; si un usuario con rol `user` intenta acceder, `ProtectedRoute` lo redirige a `/unauthorized`.
   - Los botones de crear, editar y eliminar en los listados y el enlace a `Usuarios` en el `Navbar` se renderizan únicamente cuando el usuario posee el rol `admin`.

---

## 🛠️ Instalación y Ejecución

```bash
pnpm install
pnpm dev
```
