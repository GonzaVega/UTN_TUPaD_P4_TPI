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
│   │   ├── database.py     # Engine, SessionDep, create_engine e init_db()
│   │   └── seed.py         # Poblado inicial (seed) con 3 categorías y 10 productos
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
├── test_api.http           # Demostración exhaustiva de 25 pruebas para REST Client
└── README.md
```

---

## 🌱 Carga Inicial de Datos (Database Seeding)

El sistema incluye una rutina de **seed inicial** para dotar a la base de datos de datos consistentes desde el primer arranque:

- **Ejecución en el arranque (`lifespan`):** Al levantar la API, `init_db()` verifica si las tablas `categorias` o `productos` poseen registros. Si la base está vacía, se insertan automáticamente:
  - **3 Categorías:** `Pizzas`, `Hamburguesas` y `Bebidas`.
  - **10 Productos:** 4 pizzas (*Margherita, Cuatro Quesos, Pepperoni, Fugazzeta*), 4 hamburguesas (*Clásica, Doble Cheddar & Bacon, Crispy Chicken, Veggie Burger*) y 2 bebidas (*Limonada Menta y Jengibre, Cerveza Artesanal IPA*).
  - **Asociaciones N:N:** Se insertan los registros en `producto_categoria` asignando cada producto a su categoría respectiva.
- **Idempotencia:** Si ya existen datos, el proceso se omite automáticamente para no sobreescribir ni duplicar registros.
- **Comando manual para resetear y sembrar:**
  ```bash
  python -m app.core.seed --reset
  ```

---

## 🛡️ Borrado Lógico (Soft Delete)

El backend implementa **Soft Delete** en las operaciones de eliminación para evitar la pérdida destructiva de datos y preservar la integridad referencial en relaciones N:N:

- **Modelos (`Categoria` y `Producto`):** Cuentan con el atributo `activo: bool = Field(default=True)`.
- **Servicios:**
  - `eliminar_categoria(session, id)` y `eliminar_producto(session, id)` marcan `entidad.activo = False` y realizan el commit.
  - `obtener_todas` y `obtener_todos` filtran automáticamente registros con `activo == True`.
  - `obtener_por_id` lanza un error HTTP 404 si el registro existe en la base pero posee `activo == False`.
  - La creación (`crear_categoria`) detecta si existe un registro inactivo con el mismo nombre y lo reactiva de forma transparente con los nuevos atributos.
- **Relaciones N:N:** Las consultas de productos con categorías anidadas (`/productos/{id}`) filtran únicamente las categorías activas.

---

## ⚙️ Instalación y Puesta en Marcha

### 1. Crear y activar entorno virtual

En Linux / macOS:
```bash
python3 -m venv .venv
# Nota: Si tu distribución (ej. Ubuntu/Debian) no incluye ensurepip, usar:
# virtualenv .venv   (o: sudo apt install python3-venv)
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

El archivo [`test_api.http`](./test_api.http) contiene 25 casos de prueba listos para ser ejecutados desde Visual Studio Code con la extensión *REST Client* (armonizados con los datos precargados del seed):
1. **CRUD Categorías:** consultas de categorías iniciales, altas de nuevas categorías, modificaciones, bajas y validación de conflicto de nombres (409 Conflict).
2. **CRUD Productos:** catálogo inicial de 10 productos, altas, modificaciones, bajas y validación de conflicto por duplicado (409 Conflict).
3. **Relación N:N (`Producto_Categoria`):** consulta de categorías anidadas, asociación de productos a múltiples categorías en la tabla intermedia, validación de conflicto si la relación ya existe (409 Conflict), validación de entidades inexistentes (404 Not Found) y desasociación con validación de retorno al estado original.
