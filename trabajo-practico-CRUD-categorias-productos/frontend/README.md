# Frontend - TP6: CRUD Categorías (React + TypeScript + Vite + Tailwind CSS)

Aplicación frontend desarrollada para el Trabajo Práctico 6 de la materia **Programación IV (UTN - TUPaD)**.

---

## 🛠️ Tecnologías

- **React 19**
- **TypeScript 5.7+**
- **Vite 6**
- **Tailwind CSS v4**
- **Fetch Nativo del navegador** (sin librerías externas de HTTP ni gestores globales pesados)

---

## 📋 Características y Requisitos Implementados

1. **Integración Full Stack:**
   - Consume la API REST de FastAPI alojada en `http://localhost:8000/categorias/` mediante `fetch` nativo con `async/await`.
   - Soporta operaciones completas de lectura (`GET`), creación (`POST`), edición (`PUT`) y eliminación (`DELETE`).

2. **Manejo de Estado con Hooks:**
   - `useState` en `App.tsx` para administrar la lista de categorías, el estado abierto/cerrado del modal y la categoría seleccionada para edición.
   - `useEffect` en `App.tsx` para cargar las categorías al montar el componente.
   - Componentes presentacionales puros (`Navbar.tsx`, `CategoriaCard.tsx`, `CategoriaList.tsx`) sin estado disperso.

3. **Modal Controlado (`CategoriaModal.tsx`):**
   - Modal emergente con overlay/backdrop oscuro.
   - Formulario único reutilizable tanto para el alta de nuevas categorías como para la edición de existentes.
   - Validación de campos requeridos y control de envío.

4. **Tipado Estricto con TypeScript:**
   - Interface `Categoria` en `src/types/categoria.ts`.
   - Interface `Producto` en `src/types/producto.ts`.
   - Todas las props de componentes tipadas explícitamente (`NavbarProps`, `CategoriaCardProps`, `CategoriaListProps`, `CategoriaModalProps`).

---

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias con pnpm

```bash
pnpm install
```

### 2. Ejecutar servidor de desarrollo

```bash
pnpm dev
```
La aplicación quedará disponible en: `http://localhost:5173`

### 3. Compilación de producción (Type Check)

```bash
pnpm build
```
Valida que no existan errores de tipado en TypeScript y genera el bundle estático.
