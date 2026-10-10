# Trabajo Práctico 6: CRUD Categorías + CRUD Productos (Full Stack)

**Materia:** Programación IV  
**Carrera:** Tecnicatura Universitaria en Programación a Distancia (TUPaD)  
**Institución:** Universidad Tecnológica Nacional (UTN)  
**Alumno:** Gonzalo Vega  

---

## 🎯 Objetivo del Trabajo Práctico

Desarrollar una aplicación Full Stack integrando un frontend en **React + TypeScript + Vite + Tailwind CSS** con un backend en **FastAPI + SQLModel**:
- Implementar el CRUD completo de **Categorías** desde la interfaz de usuario mediante `fetch` nativo.
- Desarrollar los CRUDs de **Producto** y **ProductoCategoria** (relación Muchos a Muchos $N:N$) en el backend.
- Demostrar el funcionamiento completo del backend y sus relaciones mediante un archivo para REST Client (`test_api.http`).

---

## 📁 Estructura del Repositorio

```text
trabajo-practico-CRUD-categorias-productos/
│
├── backend/                        # API REST con FastAPI + SQLModel
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # Instancia FastAPI y middleware CORS
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── database.py         # Conexión, SessionDep y creación de tablas
│   │   │   └── seed.py             # Poblado inicial (seed) de 3 categorías y 10 productos
│   │   ├── categoria/
│   │   │   ├── __init__.py
│   │   │   ├── router.py           # Endpoints HTTP (/categorias)
│   │   │   ├── model.py            # Modelo SQLModel y tabla intermedia N:N
│   │   │   ├── schema.py           # Schemas Pydantic
│   │   │   └── service.py          # Lógica de negocio y validación de duplicados
│   │   └── producto/
│   │       ├── __init__.py
│   │       ├── router.py           # Endpoints HTTP (/productos) y relación N:N
│   │       ├── model.py            # Modelo SQLModel con relación Muchos a Muchos
│   │       ├── schema.py           # Schemas Pydantic (Create, Update, Read, ConCategorias)
│   │       └── service.py          # Lógica de negocio y gestión de enlaces N:N
│   ├── .env                        # Configuración de base de datos (DATABASE_URL)
│   ├── .env.example
│   ├── .gitignore
│   ├── requirements.txt            # Dependencias Python
│   ├── test_api.http               # Suite de 25 pruebas para extensión REST Client
│   └── README.md
│
├── frontend/                       # Aplicación SPA React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx          # Barra de navegación
│   │   │   ├── CategoriaCard.tsx   # Fila de categoría con botones Editar y Eliminar
│   │   │   ├── CategoriaList.tsx   # Tabla/Lista de categorías
│   │   │   └── CategoriaModal.tsx  # Modal controlado para Crear y Editar
│   │   ├── types/
│   │   │   ├── categoria.ts        # Interface Categoria y CategoriaFormData
│   │   │   └── producto.ts         # Interface Producto
│   │   ├── App.tsx                 # Estado centralizado (useState), useEffect y fetch nativo
│   │   ├── main.tsx
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

## 🌱 Carga Inicial de Datos (Database Seeding)

Para garantizar que el catálogo cuente con datos consistentes al iniciar el proyecto y permitir interactuar de inmediato con el CRUD de Categorías en React y las relaciones Muchos a Muchos en FastAPI, se implementó un mecanismo de **poblado inicial automático**:

- **Ejecución automática:** Al iniciar el backend por primera vez (`lifespan` en `main.py` -> `init_db()`), si las tablas se encuentran vacías, se cargan automáticamente:
  - **3 Categorías iniciales:**
    1. `Pizzas`: Pizzas artesanales con masa madre, fermentación en frío e ingredientes frescos seleccionados.
    2. `Hamburguesas`: Hamburguesas gourmet con medallones de carne seleccionada, queso fundido y panes artesanales.
    3. `Bebidas`: Gaseosas, jugos naturales exprimidos, aguas saborizadas y cervezas artesanales.
  - **10 Productos iniciales:**
    - *Pizzas (4):* Pizza Margherita, Pizza Cuatro Quesos, Pizza Pepperoni, Pizza Fugazzeta.
    - *Hamburguesas (4):* Hamburguesa Clásica, Hamburguesa Doble Cheddar & Bacon, Hamburguesa Crispy Chicken, Hamburguesa Veggie Burger.
    - *Bebidas (2):* Limonada Menta y Jengibre, Cerveza Artesanal IPA.
  - **Asociaciones N:N:** Cada producto se vincula automáticamente en la tabla intermedia `producto_categoria` con su categoría correspondiente.
- **Idempotencia:** En reinicios posteriores del servidor, el sistema comprueba la existencia de registros y omite la inserción, preservando las modificaciones realizadas por el usuario.
- **Comando manual (CLI):** Es posible forzar un reseteo y repoblado limpio en cualquier momento:
  ```bash
  cd backend
  source .venv/bin/activate
  python -m app.core.seed --reset
  ```

---

## 🛡️ Decisión de Arquitectura: Borrado Lógico (Soft Delete)

Por buenas prácticas de ingeniería de software y arquitectura de datos empresarial, **se reemplazó el borrado físico (`HARD DELETE`) por borrado lógico (`SOFT DELETE`)**:

- **Problema del borrado físico tradicional:** Ejecutar un `DELETE FROM ...` destruye el historial transaccional, rompe la trazabilidad y puede ocasionar fallas por integridad referencial o borrados en cascada no deseados en tablas vinculadas (`producto_categoria`).
- **Implementación:**
  - Se agregó el campo `activo: bool = Field(default=True, nullable=False)` tanto en el modelo `Categoria` como en `Producto`.
  - **Eliminación (`DELETE /categorias/{id}` y `DELETE /productos/{id}`):** En lugar de destruir la fila, el servicio actualiza `entidad.activo = False` y persiste el cambio.
  - **Consultas (`GET`):** Todos los listados y búsquedas filtran automáticamente únicamente los registros activos (`where(Modelo.activo == True)`). Los elementos desactivados devuelven `404 Not Found`.
  - **Integridad referencial y reactivación:** Si se intenta crear una categoría con el mismo nombre que una eliminada previamente, el backend detecta el registro inactivo, lo actualiza con los nuevos datos y lo reactiva (`activo = True`), evitando conflictos de clave única en la base de datos.
  - **Transparencia en el Frontend:** La SPA de React consume la API de manera estándar: al invocar la eliminación, el elemento desaparece de la vista y del estado local sin requerir lógica especial en el cliente.

---

## ⚡ Guía Rápida de Ejecución

### 1. Iniciar el Backend

```bash
cd backend
python3 -m venv .venv
# Si el sistema no posee ensurepip (Ubuntu/Debian): virtualenv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
- Documentación Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Iniciar el Frontend

En otra terminal:
```bash
cd frontend
pnpm install
pnpm dev
```
- Aplicación web: [http://localhost:5173](http://localhost:5173)

---

## 📦 Modalidad de Entrega (según consigna)

- Eliminar carpetas `node_modules` y `.venv` antes de comprimir.
- Proyecto Frontend comprimido en un archivo `.zip`.
- Proyecto Backend comprimido en un archivo `.zip` con el archivo `test_api.http` incluido.
