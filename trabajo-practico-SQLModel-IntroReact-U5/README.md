# Programación IV — Trabajo Práctico Integrador Unidad 5
## Persistencia con SQLModel en PostgreSQL & Maquetado React con TypeScript

**Carrera:** Tecnicatura Universitaria en Programación a Distancia  
**Materia:** Programación IV  
**Estudiante:** Gonzalo Vega  

---

## 📌 Descripción General

Este proyecto integra los dos componentes desarrollados para la Unidad 5:

1. **Parte A — Backend:** Migración del «Gestor de Productos» desde almacenamiento volátil en memoria a una base de datos relacional **PostgreSQL** mediante **SQLModel** y **FastAPI**, respetando una arquitectura modular por capas (*Router → Service → Schema → Model*), validaciones estrictas y reglas de negocio.
2. **Parte B — Frontend:** Maquetado estático de la pantalla del catálogo de productos con **React**, **TypeScript**, **Vite** y **Tailwind CSS v4**, empleando componentes funcionales puros sin hooks, fuertemente tipados y basados en props.

---

## 📂 Estructura del Repositorio

```
trabajo-practico-SQLModel-IntroReact-U5/
│
├── backend/
│   ├── main.py                     # Inicialización de FastAPI, lifespan, CORS y montaje de routers
│   ├── database.py                 # Engine de SQLModel, sesiones de BD y creación de tablas
│   ├── requirements.txt            # Dependencias Python (fastapi, uvicorn, sqlmodel, psycopg, etc.)
│   ├── .env.example                # Variables de entorno de referencia (DATABASE_URL)
│   ├── README.md                   # Documentación detallada del backend
│   ├── tests/
│   │   ├── test_api.http           # Suite de pruebas para extensión REST Client de VS Code
│   │   ├── postman_collection.json # Colección de pruebas para Postman (v2.1)
│   │   └── test_backend.py         # Script de pruebas automatizadas de integración
│   └── app/
│       ├── models/
│       │   └── producto.py         # Modelo persistente SQLModel (table=True)
│       ├── schemas/
│       │   └── producto.py         # Schemas de validación Pydantic (Base, Create, Update, Response)
│       ├── services/
│       │   └── producto_service.py # Capa de lógica de negocio (conflictos 409, cálculo de stock)
│       └── routers/
│           └── producto_router.py  # Endpoints REST delegando directamente al service
│
└── frontend/
    ├── index.html                  # Plantilla HTML con contenedor #root
    ├── package.json                # Configuración de Vite, React y Tailwind CSS
    ├── tsconfig.json               # Configuración del compilador TypeScript
    ├── vite.config.ts              # Configuración de Vite con plugin @tailwindcss/vite
    ├── README.md                   # Documentación detallada del frontend
    └── src/
        ├── main.tsx                # Entrada de la aplicación React
        ├── App.tsx                 # Componente padre con productos mock y orquestación
        ├── index.css               # Estilos globales con @import "tailwindcss";
        ├── types/
        │   └── producto.ts         # Interface Producto (id, nombre, descripcion, precio, categoria)
        └── components/
            ├── Navbar.tsx          # Barra superior con logo y título
            ├── ProductoForm.tsx    # Formulario estático de nuevo producto
            ├── ProductoList.tsx    # Listado con mapeo .map() y key única
            ├── ProductoCard.tsx    # Tarjeta / fila individual de producto con props tipados
            └── Footer.tsx          # Pie de página institucional
```

---

## ⚡ Guía Rápida de Puesta en Marcha

### 1. Backend (FastAPI + SQLModel + PostgreSQL)

```bash
cd backend

# Crear entorno virtual e instalar dependencias
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Configurar base de datos (PostgreSQL debe estar corriendo)
# Si no existe, crear la BD: createdb tp5_productos
cp .env.example .env

# Iniciar servidor
uvicorn main:app --reload
```
- API activa en: [http://localhost:8000](http://localhost:8000)
- Documentación Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Ejecutar pruebas automatizadas: `python3 tests/test_backend.py`

### 2. Frontend (React + TypeScript + Tailwind CSS)

```bash
cd frontend

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```
- Aplicación activa en: [http://localhost:5173](http://localhost:5173)
- Validar tipos y compilar: `pnpm build`

---

## 📦 Modalidad de Entrega

Para generar el archivo comprimido `.zip` requerido por la cátedra sin dependencias pesadas:
```bash
# 1. Asegurar que no existan las carpetas node_modules ni .venv
rm -rf frontend/node_modules backend/.venv

# 2. Comprimir todo el contenido
zip -r TP5_Vega_Gonzalo.zip backend frontend README.md .gitignore
```
Al descomprimir, `pnpm install + pnpm dev` en `frontend/` y `pip install -r requirements.txt` en `backend/` funcionarán de forma inmediata y sin errores.
