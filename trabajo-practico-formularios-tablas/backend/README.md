# Backend - TP8: Formularios y Tablas (FastAPI + SQLModel + UoW)

Backend profesional desarrollado para la materia **Programación IV (UTN - TUPaD)** correspondiente al Trabajo Práctico 8: Formularios y Tablas, como evolución incremental del Trabajo Práctico 7.

---

## 🚀 Tecnologías y Patrones de Diseño

- **Python 3.10+**
- **FastAPI:** Framework web asíncrono y de alto rendimiento para APIs RESTful con documentación automática OpenAPI en `/docs`.
- **SQLModel & Pydantic v2:** Modelado relacional declarativo y validación estricta de esquemas (DTOs).
- **PostgreSQL / psycopg:** Persistencia de datos en base de datos relacional PostgreSQL (con soporte configurable vía `.env`).
- **Repository Pattern:** Encapsula el acceso a datos y aísla las consultas de la lógica de negocio; desacopla el commit del flujo de persistencia mediante llamadas a `flush()`.
- **Unit of Work Pattern (UoW):** Control centralizado de transacciones atómicas mediante un context manager (`with uow:`): confirma todos los cambios con `commit()` al completar el caso de uso exitosamente, o revierte automáticamente con `rollback()` ante excepciones de dominio.

---

## 📂 Arquitectura del Backend

El proyecto implementa la arquitectura en capas requerida:

```text
backend/
├── app/
│   ├── core/
│   │   ├── database.py             # Engine de BD, SessionDep, create_engine e init_db()
│   │   ├── repository.py           # BaseRepository genérico (CRUD desacoplado de commit)
│   │   ├── unit_of_work.py         # BaseUnitOfWork (control atómico de commit/rollback)
│   │   └── seed.py                 # Poblado inicial con categorías, productos e ingredientes
│   ├── categoria/
│   │   ├── model.py                # Modelo Categoria y ProductoCategoria
│   │   ├── schema.py               # Schemas Pydantic
│   │   ├── service.py              # Lógica de negocio de categorías
│   │   └── router.py               # Endpoints REST (/categorias)
│   ├── producto/
│   │   ├── model.py                # Modelo Producto con relación N:N
│   │   ├── schema.py               # Schemas Pydantic
│   │   ├── service.py              # Lógica de negocio y soft-delete
│   │   └── router.py               # Endpoints REST (/productos)
│   ├── ingrediente/                # [NUEVO TP8]
│   │   ├── model.py                # Modelo Ingrediente
│   │   ├── schema.py               # Validación Pydantic (RN-10: nombre obligatorio)
│   │   ├── service.py              # CRUD de ingredientes y unicidad
│   │   └── router.py               # Endpoints REST (/ingredientes)
│   ├── pedidos/                    # [NUEVO TP8: Arquitectura UoW / Repository]
│   │   ├── models.py               # Modelos Pedido y DetallePedido (clave compuesta)
│   │   ├── schemas.py              # PedidoCreate, DetallePedidoCreate, PedidoRead, etc.
│   │   ├── exceptions.py           # Excepciones de dominio (ProductoNoEncontrado, etc.)
│   │   ├── repository.py           # PedidoRepository, DetallePedidoRepository, ProductoRepository
│   │   ├── unit_of_work.py         # PedidoUnitOfWork con session_factory
│   │   ├── service.py              # PedidoService con transacción atómica
│   │   └── router.py               # Endpoints REST (/pedidos)
│   └── main.py                     # Instancia y reexportación
├── main.py                         # Configuración FastAPI, CORS y registro de routers
├── pedidos.http                    # [NUEVO TP8] Suite de pruebas exhaustiva para Pedidos
├── test_api.http                   # Demostración completa de Categorías, Productos, Ingredientes y Pedidos
├── .env                            # Variable DATABASE_URL para PostgreSQL
├── .env.example
├── requirements.txt
└── README.md
```

---

## 📦 Módulo de Pedidos (Unit of Work + Repositorios)

El módulo de pedidos atiende los casos de uso donde múltiples escrituras en la base de datos deben garantizar atomicidad (todo persiste o nada se guarda):

1. **Creación atómica (`POST /pedidos`):**
   - Valida que el pedido tenga al menos un detalle y que no contenga productos duplicados (**RN-12**, responde **422**).
   - Valida que la cantidad de cada ítem sea mayor o igual a 1 (**RN-12**, responde **422**).
   - Inicia la transacción con `with self.uow as uow:`.
   - Crea el registro de `Pedido` (estado inicial `PENDIENTE`, total `0.0`).
   - Por cada detalle, busca el producto mediante `uow.productos.get_by_id`. Si algún producto no existe o está inactivo, lanza `ProductoNoEncontrado`, provocando el **rollback inmediato** de toda la operación y respondiendo **404** sin persistir registros huérfanos.
   - Realiza un snapshot del `precio_base` del producto como `precio_unitario` en el `DetallePedido`.
   - Acumula el total monetario y actualiza el pedido.
   - Confirma la transacción atómica con `commit()` al salir del bloque `with`.

2. **Listado y Consulta (`GET /pedidos` y `GET /pedidos/{id}`):**
   - Lista únicamente pedidos no eliminados (`deleted_at is None`).
   - Al consultar por ID devuelve la entidad completa con la lista de sus detalles. Responde **404** si el pedido no existe o fue eliminado lógicamente (**RN-13**).

3. **Actualización de Estado (`PUT /pedidos/{id}`):**
   - Permite transicionar entre estados válidos: `PENDIENTE`, `CONFIRMADO`, `ENTREGADO` o `CANCELADO`. Un valor no permitido responde **422**.
   - Impide modificar pedidos en estados terminales (`ENTREGADO`, `CANCELADO`) respondiendo **409 Conflict**.

4. **Borrado Lógico (`DELETE /pedidos/{id}`):**
   - Asigna la marca temporal en `deleted_at` y responde **204 No Content**.

---

## 🌿 Módulo de Ingredientes

Permite la administración CRUD de ingredientes para satisfacer el consumo del frontend:
- `GET /ingredientes`: Lista ingredientes activos ordenados por ID.
- `GET /ingredientes/{id}`: Detalle de un ingrediente (404 si no existe).
- `POST /ingredientes`: Alta con validación estricta de nombre no vacío (**RN-10**) y control de unicidad (409).
- `PUT /ingredientes/{id}`: Modificación de nombre.
- `DELETE /ingredientes/{id}`: Borrado lógico (`activo = False`).

---

## 🧪 Pruebas con REST Client (`.http`)

Se proveen dos archivos listos para ejecutar con la extensión REST Client de VS Code:
1. **`pedidos.http`:** Demuestra exhaustivamente el ciclo de vida del módulo de Pedidos:
   - Casos exitosos: POST 201, GET 200, PUT 200 (CONFIRMADO y ENTREGADO), DELETE 204.
   - Casos de error 422: producto duplicado en detalles, lista vacía, cantidad < 1, estado inválido.
   - Casos de error 404: producto inexistente en detalles (con rollback atómico), pedido inexistente, pedido eliminado.
2. **`test_api.http`:** Suite unificada que abarca Categorías, Productos, Relación N:N, Ingredientes y Pedidos.

---

## ⚙️ Puesta en Marcha

### 1. Entorno virtual y dependencias

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Configuración de Base de Datos (`.env`)

Por defecto configurado para PostgreSQL:
```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/tp8_pedidos
```
*(Si no dispones de un servidor PostgreSQL activo, puedes utilizar SQLite configurando `DATABASE_URL=sqlite:///./tp8.db`)*.

### 3. Ejecutar el servidor FastAPI

```bash
# Con el CLI oficial de FastAPI (según consigna TP8):
python -m fastapi dev app/main.py

# O alternativamente:
python -m fastapi dev main.py
# o con uvicorn:
uvicorn main:app --reload
```

La API estará disponible en `http://localhost:8000`.
- Documentación Swagger interactiva: `http://localhost:8000/docs`
- Redoc: `http://localhost:8000/redoc`
