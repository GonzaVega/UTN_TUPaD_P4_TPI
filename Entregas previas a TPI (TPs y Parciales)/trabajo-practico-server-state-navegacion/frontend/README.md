# Frontend - TP7: Server State & Navegación (React + TypeScript + TanStack Query + React Router)

Aplicación frontend desarrollada para el Trabajo Práctico 7 de la materia **Programación IV (UTN - TUPaD)**.

---

## 🛠️ Tecnologías

- **React 19**
- **TypeScript 5.7+**
- **Vite 6**
- **TanStack Query (React Query) v5:** Gestión del estado del servidor (Server State), deduplicación de consultas y sincronización automática de caché.
- **React Router DOM v7:** Enrutamiento declarativo del lado del cliente (SPA).
- **Tailwind CSS v4:** Estilizado moderno y utilitario con diseño responsivo.

---

## 📋 Arquitectura y Requisitos Implementados

1. **Gestión de Server State con TanStack Query:**
   - `QueryClient` configurado globalmente en `main.tsx` envolviendo la aplicación con `<QueryClientProvider>`.
   - **`useQuery`:** Utilizado en `CategoriasPage` (`queryKey: ["categorias"]`) y `ProductsPage` (`queryKey: ["productos"]`) para consultar el catálogo desde el backend sin boilerplate de `useEffect`.
   - **`useMutation`:** Implementado en `CategoriasPage` para las operaciones de alta (`POST`), modificación (`PUT`) y baja (`DELETE`).
   - **Invalidación de Caché (`invalidateQueries`):** Ante cada mutación exitosa (`onSuccess`), se invalida la clave de consulta `["categorias"]`, forzando el refresco automático y transparente de los datos en pantalla.

2. **Enrutamiento y Navegación con React Router:**
   - La aplicación está envuelta en `<BrowserRouter>` en `main.tsx`.
   - `App.tsx` **no tiene lógica de negocio**: únicamente renderiza el `Navbar` y declara el mapeo de rutas mediante `<Routes>` y `<Route>`.
   - Rutas configuradas:
     - `/` ➡️ Redirecciona automáticamente a `/categorias`.
     - `/categorias` ➡️ Renderiza `CategoriasPage`.
     - `/productos` ➡️ Renderiza `ProductsPage`.
     - `*` ➡️ Captura rutas inexistentes y redirecciona a `/categorias`.
   - `Navbar.tsx` utiliza componentes `<NavLink>` con estilos dinámicos (`isActive`) para destacar la página activa.

3. **Capa de Servicios Desacoplada (`src/services/`):**
   - `src/services/categoriaService.ts`: Funciones `getCategorias`, `getCategoriaById`, `createCategoria`, `updateCategoria`, `deleteCategoria` con manejo de errores explícito (`throw new Error`).
   - `src/services/productoService.ts`: Funciones `getProductos` y `getProductoById` para consultar los productos y sus categorías vinculadas.

4. **Componentes y Vistas (`src/pages/` y `src/components/`):**
   - `CategoriasPage.tsx`: Vista con CRUD completo de categorías, manejo de loading spinners, mensajes de error y modal controlado.
   - `ProductsPage.tsx`: Catálogo visual con cuadrícula de productos (`ProductoCard`), mostrando precio, disponibilidad y badges de categorías relacionadas (N:N).
   - `CategoriaModal.tsx`: Formulario de alta y edición dentro de un Modal emergente controlado con estado booleano mediante `useState`.
   - `CategoriaList.tsx` y `CategoriaCard.tsx`: Tabla estilizada con acciones de edición y eliminación.

5. **Tipado Estricto en TypeScript (`src/types/`):**
   - Interfaces `Categoria` y `CategoriaFormData` en `src/types/categoria.ts`.
   - Interface `Producto` en `src/types/producto.ts`.
   - Props estrictamente tipadas en todos los componentes `.tsx`.

---

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias con pnpm

```bash
pnpm install
```
*(o alternativamente: `npm install`)*

### 2. Ejecutar servidor de desarrollo

```bash
pnpm dev
```
La aplicación quedará disponible en: [http://localhost:5173](http://localhost:5173)

### 3. Compilación de producción y chequeo de tipos (Type Check)

```bash
pnpm build
```
Valida que no existan errores de TypeScript (`tsc -b`) y genera el bundle con Vite.
