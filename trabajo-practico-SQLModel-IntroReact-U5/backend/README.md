# Backend — Gestor de Productos con SQLModel y PostgreSQL

Proyecto backend correspondiente a la **Parte A** del Trabajo Práctico de la **Unidad 5** de **Programación IV** (Tecnicatura Universitaria en Programación a Distancia - UTN).

Implementa la migración completa del catálogo de productos desde almacenamiento en memoria a **PostgreSQL** utilizando **SQLModel** y **FastAPI**, siguiendo una arquitectura en capas estricta (*Router → Service → Schema → Model*).

---

## 🏛️ Arquitectura del Proyecto

```
backend/
├── main.py                     # Inicialización de FastAPI, lifespan, CORS y montaje de routers
├── database.py                 # Engine de SQLAlchemy/SQLModel, sesión y creación de tablas
├── requirements.txt            # Dependencias del proyecto
├── .env.example                # Variables de entorno de referencia
├── tests/
│   ├── test_api.http           # Suite de pruebas para extensión REST Client de VS Code
│   └── postman_collection.json # Colección de pruebas para Postman (v2.1)
└── app/
    ├── models/
    │   └── producto.py         # Entidad persistida (table=True) con SQLModel
    ├── schemas/
    │   └── producto.py         # Contratos Pydantic: Base, Create, Update, Response, Stock
    ├── services/
    │   └── producto_service.py # Lógica de negocio (409 nombres duplicados, stock, transacciones)
    └── routers/
        └── producto_router.py  # Endpoints REST delegando directamente en la capa de servicios
```

---

## 🚀 Requisitos e Instalación

### Requisitos previos
- Python 3.12 o superior
- Servidor PostgreSQL activo

### 1. Crear y activar entorno virtual
```bash
python3 -m venv .venv
source .venv/bin/activate
```

*(En Windows: `.venv\Scripts\activate`)*

### 2. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 3. Configurar la base de datos
Crear una base de datos en PostgreSQL (por ejemplo, llamada `tp5_productos`):
```bash
createdb tp5_productos
```

Copiar el archivo de variables de entorno y editar las credenciales si fuera necesario:
```bash
cp .env.example .env
```

Contenido de `.env`:
```env
DATABASE_URL=postgresql+psycopg://usuario:password@localhost:5432/tp5_productos
```

---

## ▶️ Ejecución del Servidor

Iniciar el servidor con Uvicorn en modo desarrollo:
```bash
uvicorn main:app --reload
```

El servidor quedará disponible en: `http://localhost:8000`

---

## 📖 Documentación Interactiva

FastAPI genera automáticamente la documentación OpenAPI en:
- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🧪 Pruebas de Endpoints

Se incluyen dos suites completas de pruebas en la carpeta `tests/`:
1. **`tests/test_api.http`:** Ejecutable directamente desde VS Code con la extensión *REST Client*.
2. **`tests/postman_collection.json`:** Importable en Postman.

### Endpoints implementados:

| Método | Endpoint | Código HTTP | Descripción |
|---|---|---|---|
| `POST` | `/productos/` | `201 Created` | Crear producto en PostgreSQL |
| `GET` | `/productos/` | `200 OK` | Listar productos (con `skip` y `limit`) |
| `GET` | `/productos/{id}` | `200 OK` / `404` | Detalle de un producto por ID |
| `PUT` | `/productos/{id}` | `200 OK` / `404` | Actualizar producto |
| `DELETE` | `/productos/{id}` | `200 OK` / `404` | Eliminación física en PostgreSQL |
| `PUT` | `/productos/{id}/desactivar` | `200 OK` / `404` | Borrado lógico (`activo = False`) |
| `GET` | `/productos/{id}/stock` | `200 OK` / `404` | Consultar alerta de reposición de stock |
