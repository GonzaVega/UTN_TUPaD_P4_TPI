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
│   │   │   └── database.py         # Conexión, SessionDep y creación de tablas
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
│   ├── test_api.http               # Suite de 29 pruebas para extensión REST Client
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

## ⚡ Guía Rápida de Ejecución

### 1. Iniciar el Backend

```bash
cd backend
python3 -m venv .venv
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
