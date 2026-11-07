# Frontend — Catálogo de Productos Food Store (Parcial 2)

Aplicación web desarrollada con **React 19**, **TypeScript**, **Vite** y **Tailwind CSS 4** para la Segunda Evaluación Parcial de **Programación IV (UTN — TUPaD)**.

---

## 📂 Estructura del Proyecto

```text
frontend/
├── public/
│   └── utn-logo.png
├── src/
│   ├── assets/
│   │   └── utn-logo.png
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ProductoCard.tsx
│   │   ├── ProductoList.tsx
│   │   └── ProductoModal.tsx
│   ├── types/
│   │   ├── categoria.ts
│   │   ├── producto.ts
│   │   └── unidadMedida.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Instalación y Ejecución

1. Ingresar a la carpeta `frontend`:
   ```bash
   cd frontend
   ```

2. Instalar las dependencias:
   ```bash
   pnpm install
   ```
   *(También compatible con `npm install`)*

3. Iniciar el servidor de desarrollo:
   ```bash
   pnpm run dev
   ```
   *(También compatible con `npm run dev`)*  
   La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

4. Verificar compilación y tipado estricto (`strict: true`):
   ```bash
   pnpm run build
   ```
