# Backend — Catálogo de Productos Food Store (Parcial 2)

API REST desarrollada con **FastAPI**, **SQLModel**, **Pydantic v2** y **PostgreSQL** para la Segunda Evaluación Parcial de **Programación IV (UTN — TUPaD)**.

---

## 📂 Estructura del Proyecto

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   └── seed.py
│   └── modules/
│       ├── unidades_medida/    # __init__.py · model.py · router.py
│       ├── categorias/         # __init__.py · router.py · model.py · schema.py · service.py
│       └── productos/          # __init__.py · router.py · model.py · schema.py · service.py
├── tests/
│   ├── productos.http
│   └── relaciones.http
├── requirements.txt
└── README.md
```

---

## ⚙️ Configuración de PostgreSQL

1. **Verificar que el servicio de PostgreSQL se encuentre activo:**
   ```bash
   sudo systemctl status postgresql
   ```

2. **Crear la base de datos `foodstore_p2` (si aún no fue creada):**
   ```bash
   psql -d postgres -c "CREATE DATABASE foodstore_p2;"
   ```

3. **Cadena de conexión (`app/core/database.py`):**
   Por defecto el proyecto se conecta de forma nativa vía socket local de PostgreSQL (`postgresql+psycopg:///foodstore_p2`).
   Si el profesor o evaluador utiliza un usuario, contraseña o puerto específico en su entorno local, puede configurarlo fácilmente mediante una variable de entorno en un archivo `.env`:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/foodstore_p2
   ```

---

## 💡 Decisión de Diseño: Seed Demostrativo Automático (Poblado de Datos)

Para facilitar una **evaluación inmediata y fluida "out-of-the-box"** (tanto al probar Swagger en `/docs`, ejecutar los archivos `.http` como al abrir la interfaz web en React):

- El backend cuenta con un mecanismo de **Seed Automático e Idempotente** en [`app/core/seed.py`](app/core/seed.py) ejecutado al iniciar la API (`lifespan`):
  1. **Catálogo obligatorio de Unidades de Medida (Requerimiento 1):** Inserta las 6 unidades obligatorias (`kilogramo`, `gramo`, `litro`, `mililitro`, `pieza`, `docena`) con sus tipos Enum correspondientes (`peso`, `volumen`, `contable`).
  2. **Catálogo de demostración de Productos y Categorías:** Si la tabla `productos` está vacía, se cargan automáticamente **4 categorías gastronómicas** y **10 productos** con distintos stocks, unidades y estados:
     - Productos por peso (`kg`) con stock decimal (ej. Milanesas, Ñoquis).
     - Productos contables (`u` y `doc`) con stock entero estricto (ej. Ravioles, Empanadas).
     - Productos por volumen (`L`) (ej. Limonada).
     - Producto disponible con stock en 0 para evidenciar el indicador `hay_stock = false` (ej. Tiramisú).
- **Idempotencia:** Si la base ya contiene datos, el seed detecta los registros existentes y no duplica filas.
- **Limpieza / Reset opcional:** Si el evaluador desea vaciar y volver a sembrar la base de datos a su estado inicial, puede ejecutar:
  ```bash
  psql -d foodstore_p2 -c "TRUNCATE TABLE producto_categoria, productos, categorias, unidades_medida CASCADE;"
  ```
  Al reiniciar la API, el seed volverá a poblar las tablas automáticamente.

---

## 🚀 Instalación y Ejecución

1. **Crear y activar el entorno virtual `.venv`:**
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Iniciar el servidor:**
   ```bash
   fastapi dev app/main.py
   ```
   *(Alternativamente: `uvicorn app.main:app --reload --port 8000`)*

4. **Documentación Swagger UI:**
   - Acceder en el navegador a: [http://localhost:8000/docs](http://localhost:8000/docs)
