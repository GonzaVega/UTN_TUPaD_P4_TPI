# Trabajo Práctico 7: Server State con TanStack Query y Navegación con React Router

**Materia:** Programación IV  
**Carrera:** Tecnicatura Universitaria en Programación a Distancia (TUPaD)  
**Institución:** Universidad Tecnológica Nacional (UTN)  
**Alumno:** Gonzalo Vega

---

## 🎯 Objetivo del Trabajo Práctico

Construir una solución Full Stack incremental respecto al Trabajo Práctico 6, conectando una interfaz moderna en **React + TypeScript + Vite + Tailwind CSS** con una API REST en **FastAPI + SQLModel**:

- **Gestión del Estado del Servidor (Server State):** Reemplazar los llamados manuales en `useEffect` por **TanStack Query** (`useQuery` y `useMutation`), aplicando invalidación automática de caché ante mutaciones de datos.
- **Enrutamiento Declarativo (Client-Side Routing):** Organizar la navegación con **React Router** (`react-router-dom`), separando las vistas en páginas dedicadas (`CategoriasPage` y `ProductsPage`).
- **Desacoplamiento de Responsabilidades:** Eliminar la lógica de negocio de `App.tsx`, delegándole únicamente la renderización del `Navbar` y la definición de rutas.
- **Estructura Modular:** Organizar el código frontend en carpetas `components/`, `pages/`, `services/` y `types/` con tipado estricto en TypeScript.
- **Backend Robusto:** Mantener la arquitectura en capas (Models-Schemas-Service-Router) con soporte CORS, base de datos SQLite con seeding inicial y suite de pruebas para REST Client (`test_api.http`).

---

## 📁 Estructura del Repositorio

```text
trabajo-practico-server-state-navegacion/
│
├── backend/                        # API REST con FastAPI + SQLModel
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # Instancia FastAPI y middleware CORS
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── database.py         # Configuración de SQLite (tp7.db) y SessionDep
│   │   │   └── seed.py             # Poblado inicial (3 categorías, 10 productos y relación N:N)
│   │   ├── categoria/
│   │   │   ├── __init__.py
│   │   │   ├── router.py           # Endpoints HTTP (/categorias)
│   │   │   ├── model.py            # Modelo SQLModel y tabla intermedia N:N
│   │   │   ├── schema.py           # Schemas Pydantic (Create, Read, Update)
│   │   │   └── service.py          # Lógica de negocio y soft-delete
│   │   └── producto/
│   │       ├── __init__.py
│   │       ├── router.py           # Endpoints HTTP (/productos) y relación N:N
│   │       ├── model.py            # Modelo SQLModel con relación Muchos a Muchos
│   │       ├── schema.py           # Schemas Pydantic (Create, Update, Read, ConCategorias)
│   │       └── service.py          # Lógica de negocio y asociaciones N:N
│   ├── .env                        # Configuración de entorno (DATABASE_URL=sqlite:///./tp7.db)
│   ├── .env.example
│   ├── .gitignore
│   ├── requirements.txt            # Dependencias Python
│   ├── test_api.http               # Suite de 25 pruebas para extensión REST Client
│   ├── tp7.db                      # Base de datos SQLite inicializada con seed
│   └── README.md
│
├── frontend/                       # Aplicación SPA React + TypeScript + Vite
│   ├── src/
│   │   ├── assets/
│   │   │   └── utn-logo.png        # Isologotipo institucional de la UTN
│   │   ├── components/
│   │   │   ├── Navbar.tsx          # Barra de navegación con NavLink activos
│   │   │   ├── CategoriaCard.tsx   # Fila de tabla para cada categoría
│   │   │   ├── CategoriaList.tsx   # Contenedor de listado y estado vacío
│   │   │   ├── CategoriaModal.tsx  # Modal controlado con formulario de alta/edición
│   │   │   └── ProductoCard.tsx    # Card visual de producto con badges de categorías
│   │   ├── pages/
│   │   │   ├── CategoriasPage.tsx  # CRUD de Categorías con TanStack Query (useQuery + useMutation)
│   │   │   └── ProductsPage.tsx    # Catálogo visual de productos con useQuery
│   │   ├── services/
│   │   │   ├── categoriaService.ts # Funciones fetch asíncronas para Categorías
│   │   │   └── productoService.ts  # Funciones fetch asíncronas para Productos
│   │   ├── types/
│   │   │   ├── categoria.ts        # Interfaces Categoria y CategoriaFormData
│   │   │   └── producto.ts         # Interface Producto
│   │   ├── App.tsx                 # Solo define rutas (<Routes>, <Route>) y Navbar
│   │   ├── main.tsx                # Configura QueryClientProvider y BrowserRouter
│   │   └── index.css               # Estilos con Tailwind CSS
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── .gitignore
│   └── README.md
│
└── README.md
```

---

## 🧭 Evaluación del Diagrama de Dominio (`UML_foodstore.png`)

En el material provisto se encuentra el diagrama `UML_foodstore.png`. Al analizarlo:

- Contiene tres contextos delimitados:
  1. **Identidad & Acceso:** Modelos `Usuario`, `Rol`, `UsuarioRol` y `DireccionEntrega`.
  2. **Ventas & Transacciones:** Modelos `Pedido`, `DetallePedido`, `EstadoPedido`, `HistorialEstadoPedido` y `FormaPago`.
  3. **Catálogo de Productos:** Modelos `Producto`, `Categoria` y la tabla intermedia `ProductoCategoria`.
- **Evaluación:** El diagrama representa la arquitectura global de una plataforma de pedidos de comida integral. Sin embargo, para los alcances de la **Unidad 7 (y Unidad 6)**, la consigna especifica con precisión que el dominio de trabajo es exclusivamente el **Catálogo de Productos** (`Producto`, `Categoria` y `ProductoCategoria` con su relación Muchos a Muchos). Los módulos de usuarios, pedidos y pagos corresponden a etapas posteriores o a un proyecto integrador mayor y no forman parte de este trabajo práctico.

---

## 🔄 Principales Mejoras e Incrementos (TP6 ➡️ TP7)

| Aspecto                          | Trabajo Práctico 6                      | Trabajo Práctico 7                                                  |
| :------------------------------- | :-------------------------------------- | :------------------------------------------------------------------ |
| **Páginas / Rutas**              | Vista única monolítica en `App.tsx`     | Rutas separadas con **React Router** (`/categorias` y `/productos`) |
| **Responsabilidad de `App.tsx`** | Manejaba estado, fetch y renderizado    | Solo renderiza `Navbar` y define el mapeo de `<Routes>`             |
| **Lectura de Datos**             | `useEffect` con `fetch` manual          | **TanStack Query** `useQuery` con deduplicación y caché             |
| **Modificación de Datos**        | Funciones `fetch` manuales con setState | **TanStack Query** `useMutation` con `invalidateQueries`            |
| **Capa de Servicios**            | Funciones fetch integradas en la vista  | Carpeta `services/` desacoplada y reutilizable                      |
| **Catálogo de Productos**        | Solo probado vía backend (`.http`)      | Vista de catálogo navegable (`ProductsPage`) con tarjetas visuales  |

---

## ⚡ Guía Rápida de Ejecución

### 1. Iniciar el Backend (FastAPI)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

- Documentación interactiva Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)
- Documentación ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 2. Iniciar el Frontend (React + Vite)

En otra terminal:

```bash
cd frontend
pnpm install
pnpm dev
```

- Aplicación web: [http://localhost:5173](http://localhost:5173)

---

## 📦 Modalidad de Entrega (según consigna)

- Eliminar las carpetas `node_modules` y `.venv` antes de comprimir.
- Proyecto comprimido en un único archivo `.zip` conteniendo:
  - Carpeta con el **Proyecto Frontend**.
  - Carpeta con el **Proyecto Backend** (con archivo `test_api.http` y base de datos `tp7.db` con seeding).
