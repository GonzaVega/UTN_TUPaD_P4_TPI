# Backend - TP6: CRUD Categorías + CRUD Productos (FastAPI + SQLModel)

Backend modular desarrollado para la materia **Programación IV (UTN - TUPaD)** correspondiente al Trabajo Práctico 6.

---

## 🚀 Tecnologías Utilizadas

- **Python 3.10+**
- **FastAPI:** Framework web moderno y asíncrono para construir APIs RESTful.
- **SQLModel:** ORM basado en SQLAlchemy y Pydantic para modelado relacional y validaciones.
- **SQLite / PostgreSQL:** Persistencia de datos relacionales (SQLite por defecto para facilidad de ejecución, PostgreSQL configurable vía `.env`).
- **Pydantic v2:** Validación estricta de esquemas de entrada y salida (DTOs).

---

## 📂 Arquitectura Modular del Proyecto

Estructurado por dominio funcional conforme a las consignas del TP6:

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py             # Instancia FastAPI, configuración CORS e inclusión de routers
│   ├── core/
│   │   ├── __init__.py
│   │   └── database.py     # Engine, SessionDep, create_engine e init_db()
│   ├── categoria/
│   │   ├── __init__.py
│   │   ├── router.py       # Endpoints HTTP para Categorías (/categorias)
│   │   ├── model.py        # Modelo Categoria y ProductoCategoria (tabla intermedia)
│   │   ├── schema.py       # Schemas Pydantic de entrada y salida
│   │   └── service.py      # Lógica de negocio y validación de nombres duplicados
│   └── producto/
│       ├── __init__.py
│       ├── router.py       # Endpoints HTTP para Productos (/productos) y relación N:N
│       ├── model.py        # Modelo Producto con relación Muchos a Muchos
│       ├── schema.py       # Schemas Pydantic (ProductoCreate, Read, ConCategorias)
│       └── service.py      # Lógica de negocio y gestión de enlaces N:N
├── .env                    # Variables de entorno (DATABASE_URL)
├── .env.example
├── .gitignore
├── requirements.txt        # Dependencias de Python
├── test_api.http           # Demostración exhaustiva para extensión REST Client de VS Code
└── README.md
```

---

## ⚙️ Instalación y Puesta en Marcha

### 1. Crear y activar entorno virtual

En Linux / macOS:
```bash
python3 -m venv .venv
source .venv/bin/activate
```

En Windows:
```cmd
python -m venv .venv
.venv\Scripts\activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Iniciar el servidor

```bash
python -m uvicorn main:app --reload --port 8000
```
o bien con el comando de FastAPI CLI:
```bash
python -m fastapi dev main.py
```

El servidor estará accesible en: `http://localhost:8000`

---

## 📖 Documentación Interactiva

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🧪 Demostración con REST Client (`test_api.http`)

El archivo [`test_api.http`](./test_api.http) contiene 29 casos de prueba listos para ser ejecutados desde Visual Studio Code con la extensión *REST Client*:
1. **CRUD Categorías:** altas, bajas, modificaciones, consultas y validación de conflicto de nombres (409 Conflict).
2. **CRUD Productos:** catálogo con precios, disponibilidad y validaciones de datos.
3. **Relación N:N (`Producto_Categoria`):** asociación de productos a categorías en la tabla intermedia, demostración de producto con múltiples categorías, validación de conflicto si la relación ya existe (409 Conflict) y validación de entidades inexistentes (404 Not Found).
