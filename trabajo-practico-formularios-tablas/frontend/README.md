# Frontend - TP8: Formularios y Tablas (React + TypeScript + TanStack Form & Table)

Aplicación frontend moderna desarrollada para el Trabajo Práctico 8 de la materia **Programación IV (UTN - TUPaD)**, construida como evolución incremental del TP7.

---

## 🛠️ Tecnologías

- **React 19**
- **TypeScript 5.7+ (Tipado estricto sin `any`)**
- **Vite 6**
- **TanStack Table (v8):** Motor headless para tablas interactivas con ordenamiento multi-columna y paginación client-side.
- **TanStack Form:** Formularios fuertemente tipados con inferencia automática, validaciones declarativas (`onSubmit`, `onBlur`, `onChange`) y reactividad granular con `form.Subscribe`.
- **TanStack Query (React Query v5):** Manejo de Server State, invalidación automática de caché (`invalidateQueries`) y mutaciones asíncronas.
- **React Router DOM v7:** Enrutamiento declarativo del lado del cliente.
- **Tailwind CSS v4:** Sistema de diseño utilitario, estados de UI consistentes y modales responsivos.

---

## 📋 Arquitectura y Funcionalidades del TP8

### 1. Tablas Interactivas con TanStack Table v8
- Columnas fuertemente tipadas mediante `createColumnHelper`.
- **Ordenamiento (Sorting):** Encabezados interactivos con indicadores visuales de dirección (`▲`, `▼`, `⇅`) implementados con `getSortedRowModel`.
- **Paginación:** Barra de controles reutilizable (`Pagination.tsx`) con botones anterior/siguiente, recuento de registros, página actual y selector de tamaño de página (5, 10, 20, 50).
- Componentes dedicados: `CategoriaTable.tsx`, `ProductoTable.tsx` e `IngredienteTable.tsx`.

### 2. Formularios Tipados con TanStack Form
- Instancias declaradas mediante el hook `useForm`.
- Cada input está encapsulado en un `form.Field` con vinculación tipada de valor (`value`), manejo de desenfoque (`onBlur` para `handleBlur`) y cambio (`onChange` con conversión numérica donde aplica).
- **Validaciones:** Comprobación de campos obligatorios, espacios en blanco y valores numéricos no negativos.
- **Botón de Enviar Reactivo:** Renderizado con `form.Subscribe`, reaccionando a los estados `canSubmit` e `isSubmitting` para deshabilitar el botón mientras el formulario sea inválido o esté en proceso de envío.
- **Manejo de Errores del Servidor:** Si la API devuelve un error (ej. 409 por conflicto de duplicado o 422), el mensaje se visualiza dentro del modal sin cerrarlo, permitiendo corregir los datos.

### 3. Vistas y Modales Controlados con `useState`
- **`CategoriasPage.tsx`:** CRUD completo con `CategoriaTable` y `CategoriaModal`.
- **`ProductsPage.tsx`:** CRUD completo de productos con `ProductoTable` y `ProductoModal`. Incluye además un botón de visualización rápida de tarjeta (`Card`) que abre `ProductoDetailModal` con la previsualización del producto (imagen, precio y badges de categorías asociadas).
- **`IngredientesPage.tsx`:** CRUD completo de ingredientes con `IngredienteTable` e `IngredienteModal`.

### 4. Componentes Comunes de Estados Visuales
- **`LoadingState.tsx`:** Spinner animado para la espera de consultas `useQuery`.
- **`EmptyState.tsx`:** Estado vacío descriptivo con botón de llamada a la acción (crear nuevo registro).
- **`ErrorState.tsx`:** Notificación amigable con botón de reintento (`refetch()`).

### 5. Navegación y Estructura en `App.tsx`
- `App.tsx` permanece limpio de lógica de negocio o estado de datos; únicamente renderiza el `Navbar` y define las rutas:
  - `/` ➡️ Redirecciona a `/categorias`
  - `/categorias` ➡️ `CategoriasPage`
  - `/productos` ➡️ `ProductsPage`
  - `/ingredientes` ➡️ `IngredientesPage`
  - `*` ➡️ Redirecciona a `/categorias`
- `Navbar.tsx` cuenta con enlaces activos (`NavLink`) a Categorías, Productos e Ingredientes.

---

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Servidor de desarrollo

```bash
pnpm dev
```
Disponible en: [http://localhost:5173](http://localhost:5173)

### 3. Validación de tipos y compilación

```bash
pnpm build
```
Ejecuta `tsc -b` (sin advertencias ni errores de TypeScript) y genera la compilación optimizada con Vite.
