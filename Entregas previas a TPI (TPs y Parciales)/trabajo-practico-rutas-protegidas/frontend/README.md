# Frontend - TP10: Arquitectura por Features y Rutas Protegidas

Proyecto desarrollado para la **Unidad 10 de Programación IV (UTN - TUPaD)**. Se refactorizó el frontend de la Unidad 9 (React + TypeScript) adoptando una **arquitectura modular orientada por features**, protección de rutas por sesión y rol mediante `ProtectedRoute` con `<Outlet />`, **custom hooks por dominio** (`useCategories`, `useProducts`, `useIngredients`, `useAuth`) y estado global de interfaz con **Zustand** (`themeStore` y `notificationStore`).

> **Nota sobre el Backend:** Siguiendo las consignas de la Unidad 10, el backend desarrollado en la Unidad 9 (FastAPI + JWT en cookie HttpOnly + roles `user` y `admin`) se reutiliza tal cual en `http://localhost:8000` sin requerir modificaciones y no vuelve a incluirse en la entrega de esta unidad.

---

## 🏗️ Estructura de Módulos por Feature

El código fuente en `src/` se organiza en módulos autónomos por dominio funcional, elementos compartidos en `shared/`, stores de interfaz en `store/` y configuración de rutas en `routes/`:

```text
src/
├── assets/
│   └── utn-logo.png
├── features/
│   ├── auth/                     # Dominio de autenticación y administración de usuarios
│   │   ├── components/
│   │   │   └── LoginForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts        # useAuth y useAdminUsers
│   │   ├── pages/
│   │   │   ├── AdminUsersPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── services/
│   │   │   └── authService.ts
│   │   ├── store/
│   │   │   └── authStore.ts      # Store de sesión sin persist (con estado checking)
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── index.ts              # Barrel export público del feature auth
│   ├── categories/               # Dominio de categorías
│   │   ├── components/
│   │   │   ├── CategoriaCard.tsx
│   │   │   ├── CategoriaList.tsx
│   │   │   ├── CategoriaModal.tsx
│   │   │   └── CategoriaTable.tsx
│   │   ├── hooks/
│   │   │   └── useCategories.ts
│   │   ├── pages/
│   │   │   └── CategoriasPage.tsx
│   │   ├── services/
│   │   │   └── categoriaService.ts
│   │   ├── types/
│   │   │   └── categoria.ts
│   │   └── index.ts              # Barrel export público del feature categories
│   ├── products/                 # Dominio de productos
│   │   ├── components/
│   │   │   ├── ProductoCard.tsx
│   │   │   ├── ProductoDetailModal.tsx
│   │   │   ├── ProductoModal.tsx
│   │   │   └── ProductoTable.tsx
│   │   ├── hooks/
│   │   │   └── useProducts.ts
│   │   ├── pages/
│   │   │   └── ProductsPage.tsx
│   │   ├── services/
│   │   │   └── productoService.ts
│   │   ├── types/
│   │   │   └── producto.ts
│   │   └── index.ts              # Barrel export público del feature products
│   └── ingredients/              # Dominio de ingredientes
│       ├── components/
│       │   ├── IngredienteModal.tsx
│       │   └── IngredienteTable.tsx
│       ├── hooks/
│       │   └── useIngredients.ts
│       ├── pages/
│       │   └── IngredientesPage.tsx
│       ├── services/
│       │   └── ingredienteService.ts
│       ├── types/
│       │   └── ingrediente.ts
│       └── index.ts              # Barrel export público del feature ingredients
├── routes/
│   ├── AppRouter.tsx             # Declaración centralizada de rutas públicas y protegidas
│   └── ProtectedRoute.tsx        # Guardián de rutas por sesión y rol usando <Outlet />
├── shared/
│   ├── api/
│   │   ├── api.ts                # Instancia de Axios con withCredentials: true
│   │   ├── setupInterceptors.ts  # Interceptor de respuesta para 401 y 403
│   │   └── index.ts
│   ├── components/               # Componentes transversales reutilizables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── LoadingState.tsx
│   │   ├── Navbar.tsx
│   │   ├── Pagination.tsx
│   │   ├── Toast.tsx
│   │   ├── UnauthorizedPage.tsx
│   │   └── index.ts
│   └── services/
│       └── apiError.ts
├── store/
│   ├── notificationStore.ts      # Estado global para notificaciones Toast (auto-cierre 3s)
│   └── themeStore.ts             # Estado global de tema claro/oscuro con persist ('theme-storage')
├── App.tsx                       # Verifica la sesión al montar (checkAuth) y renderiza AppRouter + Toast
└── main.tsx                      # Inicializa setupInterceptors(), QueryClientProvider y BrowserRouter
```

---

## 🧩 Reglas y Comportamiento Implementado

### Parte A — Estructura por Features, Barrels y Alias `@/`
- Cada feature (`auth`, `categories`, `products`, `ingredients`) agrupa sus propios `components/`, `hooks/`, `types/` y `pages/` y expone su API pública a través de `index.ts`.
- Ninguna feature importa desde subdirectorios internos de otra feature (`RA-01`); toda comunicación entre dominios se realiza mediante su barrel export (por ejemplo, `import { useAuthStore } from "@/features/auth"`).
- El alias `@/` está configurado en `vite.config.ts` y `tsconfig.app.json` apuntando a `src/`.
- `App.tsx` no contiene lógica de negocio ni hooks de datos (`RA-04`): únicamente ejecuta `checkAuth()` en un `useEffect` y monta `<AppRouter />` junto con `<Toast />`.

### Parte B — Protección de Rutas con `<Outlet />` y Manejo de 401/403
- `ProtectedRoute` (`src/routes/ProtectedRoute.tsx`) lee `user` y `checking` del store de autenticación:
  - Mientras `checking` es `true`, muestra el indicador de carga (`LoadingState`).
  - Si no hay sesión (`!user`), redirige a `/login`.
  - Si `allowedRoles` está definido y el usuario no posee ninguno de los roles requeridos, redirige a `/unauthorized`.
  - Si la sesión y el rol son válidos, renderiza las rutas hijas mediante `<Outlet />`.
- En `shared/api/setupInterceptors.ts`:
  - **401 Unauthorized** (salvo en `/auth/token` y `/auth/me`): limpia la sesión del store y redirige al login.
  - **403 Forbidden**: muestra una notificación emergente de acceso denegado sin cerrar la sesión ni redirigir.

### Parte C — Custom Hooks por Feature
- `useCategories`, `useProducts` y `useIngredients` encapsulan las consultas (`useQuery`) y mutaciones (`useMutation`) de TanStack Query y disparan notificaciones en `notificationStore` ante altas, ediciones, bajas y errores.
- `useAuth` y `useAdminUsers` encapsulan el inicio/cierre de sesión, registro y administración de usuarios, manteniendo los componentes de `pages/` libres de llamadas directas a Axios o TanStack Query (`HU-03`, `RA-07`).

### Parte D — Estado Global de Interfaz con Zustand
- **`authStore`**: No utiliza `persist` (`RA-09`). Recupera la sesión en cada carga mediante `GET /api/v1/auth/me` utilizando el indicador `checking`.
- **`themeStore`**: Almacena `darkMode` y `toggleTheme` con el middleware `persist` (`name: "theme-storage"`), sincronizando la clase `dark` en `document.documentElement` y conservando la preferencia al recargar desde el botón de la `Navbar`.
- **`notificationStore`**: Gestiona `message`, `type`, `isVisible`, `showNotification` y `hideNotification`, ocultándose automáticamente a los **3 segundos** (`3000` ms) mediante el componente `<Toast />`.

---

## 🚀 Requisitos Previos e Instalación

1. Asegurarse de tener en ejecución el **Backend de la Unidad 9** en `http://localhost:8000` (`uvicorn app.main:app --reload`).
2. Instalar dependencias y levantar el servidor de desarrollo del frontend:

```bash
pnpm install
pnpm dev
```
