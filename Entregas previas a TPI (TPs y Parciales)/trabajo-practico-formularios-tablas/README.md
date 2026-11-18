# Trabajo Práctico 8: Formularios y Tablas (TanStack Form, TanStack Table & Backend UoW)

**Materia:** Programación IV  
**Carrera:** Tecnicatura Universitaria en Programación a Distancia (TUPaD)  
**Institución:** Universidad Tecnológica Nacional (UTN)  
**Alumno:** Gonzalo Vega

---

## 🎯 Objetivo del Trabajo Práctico

Desarrollar una aplicación Full Stack profesional e incremental respecto al Trabajo Práctico 7, incorporando herramientas de última generación en el frontend y patrones de arquitectura empresarial en el backend:

1. **Frontend (React + TypeScript + Vite + Tailwind CSS):**
   - **Tablas con TanStack Table v8:** Implementación de tablas headless interactivas con tipado estricto mediante `createColumnHelper`, ordenamiento multi-columna (`getSortedRowModel`) y controles de paginación client-side (`getPaginationRowModel`) para Categorías, Productos e Ingredientes.
   - **Formularios con TanStack Form:** Reemplazo de formularios controlados tradicionales por `useForm` de `@tanstack/react-form`, vinculación tipada con `form.Field`, validaciones declarativas y estado reactivo de envío con `form.Subscribe` (`canSubmit`, `isSubmitting`).
   - **Modales Controlados:** Modales para alta y edición controlados por estado booleano (`useState`), diferenciando claramente la acción (crear vs. editar) y preservando los datos/mensajes ante errores del servidor sin cerrarse.
   - **Visualización de Producto Individual:** Visualización en modal tipo tarjeta (`ProductoDetailModal` / `ProductoCard`) al hacer clic en un producto de la tabla.
   - **Navegación con React Router:** Separación en páginas dedicadas (`CategoriasPage`, `ProductsPage`, `IngredientesPage`), con un `Navbar` responsivo y un `App.tsx` libre de lógica de negocio o estado de datos.
   - **Estados Visuales Reutilizables:** Componentes estilizados con Tailwind CSS para carga (`LoadingState`), vacío (`EmptyState`) y errores (`ErrorState`).

2. **Backend (FastAPI + SQLModel + PostgreSQL):**
   - **Arquitectura Models-Schemas-Repository-UoW-Service-Router:** Implementación del patrón **Unit of Work** y **Repository** para el módulo de Pedidos y Detalles, garantizando transacciones atómicas (commit de la operación completa o rollback si algún ítem falla).
   - **CRUD de Pedidos y DetallePedido:** Clave primaria compuesta `(pedido_id, producto_id)`, snapshot monetario del precio base del producto, cálculo del total y borrado lógico (`deleted_at`).
   - **CRUD de Ingredientes:** Endpoints REST con validaciones de datos con Pydantic (RN-10: nombre obligatorio).
   - **Demostración REST Client:** Archivos `.http` completos (`pedidos.http` y `test_api.http`) que evidencian todos los flujos exitosos (201, 200, 204) y casos de error (404 recurso no encontrado y 422 regla de negocio / producto duplicado).

---

## 📁 Estructura del Proyecto

```text
trabajo-practico-formularios-tablas/
│
├── backend/                        # API REST FastAPI + SQLModel + UoW
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── database.py         # Configuración de base de datos (PostgreSQL / SQLite)
│   │   │   ├── repository.py       # BaseRepository genérico desacoplado de commit
│   │   │   ├── unit_of_work.py     # BaseUnitOfWork con __enter__ y __exit__
│   │   │   └── seed.py             # Seed con Categorías, Productos e Ingredientes
│   │   ├── categoria/              # CRUD Categorías (Model, Schema, Service, Router)
│   │   ├── producto/               # CRUD Productos (Model, Schema, Service, Router)
│   │   ├── ingrediente/            # [NUEVO TP8] CRUD Ingredientes
│   │   └── pedidos/                # [NUEVO TP8] Módulo con UoW y Repositorios
│   │       ├── models.py           # Pedido y DetallePedido
│   │       ├── schemas.py          # PedidoCreate, DetallePedidoCreate, etc.
│   │       ├── exceptions.py       # Excepciones de dominio
│   │       ├── repository.py       # PedidoRepository, DetallePedidoRepository, ProductoRepository
│   │       ├── unit_of_work.py     # PedidoUnitOfWork
│   │       ├── service.py          # PedidoService con transacción atómica
│   │       └── router.py           # Endpoints HTTP (/pedidos)
│   ├── main.py                     # Instancia FastAPI, CORS y registro de routers
│   ├── pedidos.http                # Demostración exhaustiva de Pedidos para REST Client
│   ├── test_api.http               # Demostración integral (Cat, Prod, Ing, Ped)
│   ├── .env                        # Variables de entorno (DATABASE_URL)
│   ├── requirements.txt            # Dependencias Python
│   └── README.md
│
├── frontend/                       # SPA React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── assets/                 # Recursos gráficos
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── LoadingState.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── ErrorState.tsx
│   │   │   │   └── Pagination.tsx  # Paginador TanStack Table
│   │   │   ├── Navbar.tsx          # Enlaces a Categorías, Productos e Ingredientes
│   │   │   ├── CategoriaTable.tsx  # Tabla interactiva TanStack Table v8
│   │   │   ├── CategoriaModal.tsx  # Formulario tipado TanStack Form
│   │   │   ├── ProductoTable.tsx   # Tabla interactiva TanStack Table v8
│   │   │   ├── ProductoModal.tsx   # Formulario tipado TanStack Form
│   │   │   ├── ProductoDetailModal.tsx # Modal con vista tipo tarjeta (Card)
│   │   │   ├── ProductoCard.tsx    # Card visual del producto
│   │   │   ├── IngredienteTable.tsx# Tabla interactiva TanStack Table v8
│   │   │   └── IngredienteModal.tsx# Formulario tipado TanStack Form
│   │   ├── pages/
│   │   │   ├── CategoriasPage.tsx  # useQuery + useMutation + Table + Form
│   │   │   ├── ProductsPage.tsx    # useQuery + useMutation + Table + Form + Card Modal
│   │   │   └── IngredientesPage.tsx# useQuery + useMutation + Table + Form
│   │   ├── services/
│   │   │   ├── categoriaService.ts # Funciones fetch nativo para Categorías
│   │   │   ├── productoService.ts  # Funciones fetch nativo para Productos
│   │   │   └── ingredienteService.ts# Funciones fetch nativo para Ingredientes
│   │   ├── types/
│   │   │   ├── categoria.ts        # Interfaces TypeScript
│   │   │   ├── producto.ts         # Interfaces TypeScript
│   │   │   └── ingrediente.ts      # Interfaces TypeScript
│   │   ├── App.tsx                 # Solo rutas y Navbar
│   │   ├── main.tsx                # QueryClientProvider y BrowserRouter
│   │   └── index.css               # Tailwind CSS
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── README.md
│
└── README.md
```

---

## 🚀 Guía de Instalación y Ejecución

### 1. Iniciar el Backend

1. Acceder al directorio `backend/`:
   ```bash
   cd backend
   ```
2. Crear y activar entorno virtual:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   # En Windows: .venv\Scripts\activate
   ```
3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Configurar base de datos en `.env` (PostgreSQL por defecto, o SQLite si se desea):
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/tp8_pedidos
   ```
5. Iniciar FastAPI:
   ```bash
   python -m fastapi dev main.py
   ```
   Servidor activo en `http://localhost:8000` con Swagger UI en `http://localhost:8000/docs`.

### 2. Iniciar el Frontend

1. Acceder al directorio `frontend/`:
   ```bash
   cd frontend
   ```
2. Instalar dependencias con pnpm:
   ```bash
   pnpm install
   ```
3. Iniciar el entorno de desarrollo:
   ```bash
   pnpm dev
   ```
   La aplicación se abrirá en `http://localhost:5173`.
4. Verificar compilación y tipado TypeScript:
   ```bash
   pnpm build
   ```
