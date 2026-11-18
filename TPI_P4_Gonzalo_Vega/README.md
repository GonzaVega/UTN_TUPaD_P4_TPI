# Food Store — Sistema de Pedidos de Comida
## Trabajo Práctico Integrador Final · Programación IV

**Institución:** Universidad Tecnológica Nacional (UTN)  
**Carrera:** Tecnicatura Universitaria en Programación a Distancia (TUPaD)  
**Materia:** Programación IV  
**Profesor:** Luciano Chiroli  
**Estudiante:** Gonzalo Vega  
**Repositorio GitHub:** [https://github.com/GonzaVega/UTN_TUPaD_P4_TPI](https://github.com/GonzaVega/UTN_TUPaD_P4_TPI)  
**Video de Demostración:** `[Pegar aquí enlace público de YouTube / Drive / Loom]`

---

## 📌 Descripción del Proyecto y Arquitectura

Food Store es una aplicación web full stack para un negocio de comidas donde los clientes pueden registrarse, explorar el catálogo con búsqueda y filtros por categoría, armar su carrito y confirmar pedidos con cálculo de subtotales, validación de stock y dirección de entrega. Los administradores disponen de un panel de control con indicadores de ventas, ABM de categorías y productos con carga de imágenes y cambio rápido de stock/disponibilidad, gestión de usuarios (activación/desactivación) y control de avance de pedidos mediante una máquina de estados transaccional.

### 🏗️ Backend
- **Framework & ORM:** FastAPI 0.115+ y SQLModel sobre **PostgreSQL**.
- **Arquitectura en capas estricta:**
  - `Router`: recepción HTTP, validación con schemas DTO, resolución de dependencias (`Depends`).
  - `Service`: lógica de negocio pura y orquestación dentro de transacciones atómicas.
  - `Unit of Work`: gestión del ciclo de vida de la transacción en `__enter__` y confirmación (`commit`), reversión (`rollback`) y cierre (`close`) automático en `__exit__`. Ningún router ni service ejecuta `session.commit()`.
  - `Repository`: consultas encapsuladas heredando de `BaseRepository[T]` sobre la sesión compartida.
  - `Models`: tablas SQLModel persistentes con baja lógica (`activo = false`) e inmutabilidad en líneas de detalle.
- **Autenticación & Autorización:** JWT en cookie `HttpOnly` (`access_token`) con expiración a 30 minutos y control de roles (`user` y `admin`).
- **Documentación OpenAPI interactiva:** disponible en `/docs` (Swagger UI) y `/redoc`.

### 🎨 Frontend
- **Framework & Build:** React 19 + TypeScript 5.9+ en modo estricto (`strict: true`, cero `any`) compilado con Vite 7 y estilado con Tailwind CSS 4.
- **Arquitectura por Features:** modularización por dominio en `src/features/` (`auth`, `categorias`, `productos`, `pedidos`, `usuarios`), separada de utilidades transversales (`src/shared/`), estado global del cliente (`src/store/`) y enrutamiento (`src/routes/`).
- **Manejo de Estado Desacoplado:**
  - **Server State:** TanStack Query v5 (`useQuery`, `useMutation`, invalidación inteligente de caché). Prohibido el uso de `fetch` + `useEffect` en vistas.
  - **Client State:** Zustand v5 con middleware `persist` para persistencia en almacenamiento local de la sesión (`authStore`, guardando solo datos públicos sin almacenar el token) y del carrito (`cartStore`).
- **Componentes Avanzados:** TanStack Table v8 para administración de datos y TanStack Form v1 para validación granular reactiva en formularios y modales.

---

## ⚙️ Requisitos Previos

- **Python:** versión 3.11 a 3.13 instalada.
- **Node.js:** versión 20.19 o superior.
- **pnpm:** versión 9 o superior (o `corepack enable && corepack prepare pnpm@latest --activate`).
- **PostgreSQL:** versión 15 o superior corriendo localmente en el puerto 5432.

---

## 🚀 Puesta en Marcha Paso a Paso

### 1. Base de Datos (PostgreSQL)

El proyecto utiliza **PostgreSQL** como motor de persistencia principal. Asegúrate de tener el servicio PostgreSQL iniciado en tu sistema y crea la base de datos `foodstore_db`:

```bash
# Opción 1: Mediante psql
psql -U postgres -c "CREATE DATABASE foodstore_db;"

# Opción 2: En Linux con el comando createdb
createdb foodstore_db
```

---

### 2. Backend (FastAPI + SQLModel + PostgreSQL)

```bash
cd backend

# 1. Crear el entorno virtual e instalar las dependencias con versiones fijadas
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 2. Configurar variables de entorno
cp .env.example .env

# Nota: Si tu PostgreSQL requiere usuario y contraseña, edita el archivo .env:
# DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/foodstore_db
# En Linux con autenticación local estándar por socket puedes dejar:
# DATABASE_URL=postgresql:///foodstore_db

# 3. Ejecutar el seed inicial (idempotente: crea usuario admin, categorías y productos con stock)
python -m app.db.seed

# 4. Iniciar el servidor backend en modo desarrollo
uvicorn app.main:app --reload --port 8000
```

- **API activa en:** [http://localhost:8000](http://localhost:8000)
- **Documentación Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Documentación ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

### 3. Frontend (React + TypeScript + Vite + Tailwind CSS)

En una nueva terminal:

```bash
cd frontend

# 1. Copiar variables de entorno
cp .env.example .env

# 2. Instalar dependencias con pnpm
pnpm install

# 3. Verificar tipos de TypeScript y compilar
pnpm build

# 4. Iniciar el servidor de desarrollo
pnpm dev
```

- **Aplicación web activa en:** [http://localhost:5173](http://localhost:5173)

---

## 🔑 Credenciales del Sistema (Cargadas por el Seed)

| Rol | Usuario | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `Admin1234!` | Acceso completo al panel `/admin`: métricas, categorías, productos, stock, transiciones de pedidos y gestión de usuarios. |
| **Cliente de prueba** | Auto-registro en `/register` | — | Permiso para navegar el catálogo, agregar al carrito, confirmar pedidos con dirección y cancelar pedidos propios en estado `PENDIENTE`. |

---

## 🔒 Variables de Entorno

### Backend (`backend/.env`)

| Variable | Descripción | Valor por defecto |
| :--- | :--- | :--- |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL | `postgresql:///foodstore_db` |
| `SECRET_KEY` | Clave criptográfica para firma de tokens JWT (mín. 32 caracteres) | `clave-secreta-super-segura-para-desarrollo-local-utn-p4-2026` |
| `ALGORITHM` | Algoritmo de firma JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración de la cookie de sesión | `30` |
| `FRONTEND_ORIGIN` | Origen permitido por CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Descripción | Valor por defecto |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base de la API REST backend | `http://localhost:8000/api/v1` |

---

## 🧪 Verificación de Reglas de Negocio y Pruebas

Para ejecutar la suite de pruebas automatizadas de integración contra PostgreSQL:

```bash
cd backend
PYTHONPATH=. .venv/bin/pytest -v tests/test_api_suite.py
```

### Casos verificados:
- **RN-01 (Creación de pedido):** Validación de ítems no repetidos, stock suficiente y descuento transaccional en PostgreSQL. Rollback total si falla algún ítem.
- **RN-02 (Máquina de estados):** `PENDIENTE` $\rightarrow$ `EN_PREPARACION` $\rightarrow$ `ENTREGADO`. Prohibido modificar pedidos en estados terminales (`ENTREGADO`, `CANCELADO`).
- **RN-03 (Restitución de stock):** Al cancelar un pedido, las cantidades de cada detalle se restituyen automáticamente al stock del producto.
- **RN-04 (Permisos por rol y dueño):** Clientes solo acceden y cancelan sus propios pedidos desde `PENDIENTE`. Administradores acceden a todos y comandan la máquina de estados.
- **RN-05 (Inmutabilidad):** Copia fija de `nombre_producto` y `precio_unitario` en `DetallePedido`. Prohibida la edición o borrado de pedidos confirmados.
- **RN-06 (Validación de datos):** Validación de `forma_pago` (`EFECTIVO` / `TRANSFERENCIA`) y `direccion_entrega` (5 a 200 caracteres).

