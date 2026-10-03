# Frontend — TP Productos con React, TypeScript y Tailwind CSS

Proyecto frontend correspondiente a la **Parte B** del Trabajo Práctico de la **Unidad 5** de **Programación IV** (Tecnicatura Universitaria en Programación a Distancia - UTN).

Implementa la pantalla de catálogo de productos utilizando **React**, **TypeScript**, **Vite** y **Tailwind CSS v4**, aplicando componentización modular, tipado estricto sin `any` y **componentes funcionales puros sin hooks**.

---

## 🏛️ Estructura del Proyecto

```
frontend/
├── index.html                  # Plantilla HTML con contenedor raíz #root
├── package.json                # Configuración de dependencias y scripts de Vite
├── tsconfig.json               # Configuración estricta del compilador TypeScript
├── vite.config.ts              # Configuración de Vite con plugin @tailwindcss/vite
├── src/
│   ├── main.tsx                # Entrada de la aplicación y montaje en el DOM
│   ├── App.tsx                 # Componente padre con los productos mock y orquestación
│   ├── index.css               # Importación oficial de Tailwind CSS v4 (@import "tailwindcss";)
│   ├── types/
│   │   └── producto.ts         # Definición de la interface Producto (id, nombre, descripcion, precio, categoria)
│   └── components/
│       ├── Navbar.tsx          # Barra superior con icono y título de la aplicación
│       ├── ProductoForm.tsx    # Formulario estático de alta de producto
│       ├── ProductoList.tsx    # Lista que recibe Producto[] y mapea en ProductoCard
│       ├── ProductoCard.tsx    # Tarjeta individual con props tipados
│       └── Footer.tsx          # Pie de página institucional
```

---

## 📋 Principios de Diseño Aplicados

- **Componentes Funcionales Puros (HU-06 / RN-09):** Todos los componentes son funciones sin `useState`, `useEffect` ni ningún hook de React. No se ejecutan llamadas a APIs externas ni lógica de estado compleja.
- **Flujo Unidireccional de Datos:** Los datos residen en el componente padre (`App.tsx`) y fluyen hacia abajo a través de props estrictamente tipados.
- **Tipado Estricto (HU-04 / RN-08):** Todo elemento y prop está tipado con TypeScript. No se utiliza el tipo `any`.
- **Renderizado de Listas con `.map()` y `key`:** `ProductoList` itera sobre el arreglo de productos garantizando una clave única mediante `producto.id`.
- **Estilos con Tailwind CSS v4 (HU-05):** Maquetado responsivo utilizando clases utilitarias (`flex`, `grid`, espaciados modulares de la escala 4px, paleta armoniosa con índigo y slate).

---

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Ejecutar servidor de desarrollo
```bash
pnpm dev
```
La aplicación quedará disponible en: `http://localhost:5173`

### 3. Compilar para producción (validación de tipos)
```bash
pnpm build
```
