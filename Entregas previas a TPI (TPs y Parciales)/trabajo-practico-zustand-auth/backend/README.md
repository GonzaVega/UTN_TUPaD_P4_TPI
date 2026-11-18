# Backend - TP9: Estado Global con Zustand y Autenticación (FastAPI + JWT HttpOnly + RBAC)

Backend desarrollado para la **Unidad 9 de Programación IV (UTN - TUPaD)**. Extiende el sistema de Food Store incorporando el dominio de **Identidad & Acceso** (`Usuario`, `Rol`, `UsuarioRol`), autenticación con **JWT en cookie HttpOnly**, autorización por roles (**RBAC**) y **borrado lógico (`deleted_at`)**.

---

## 📂 Estructura del Proyecto

```text
backend/
├── app/
│   ├── core/
│   │   ├── config.py               # Configuración centralizada (.env)
│   │   ├── database.py             # Engine, SessionDep e init_db()
│   │   ├── deps.py                 # get_current_user, get_current_active_user, require_role
│   │   ├── security.py             # Hash bcrypt y firma/validación de JWT
│   │   ├── seed.py                 # Carga inicial de roles (admin, user), usuarios y catálogo
│   │   ├── repository.py
│   │   └── unit_of_work.py
│   ├── modules/
│   │   └── usuarios/
│   │       ├── models.py           # Usuario, Rol y UsuarioRol
│   │       ├── schemas.py          # UserCreate, UserPublic, RolRead
│   │       ├── repository.py       # Consultas de usuarios y roles vigentes
│   │       ├── service.py          # Registro, autenticación, activación y desactivación
│   │       └── router.py           # Endpoints /auth, /admin/usuarios y /roles
│   ├── categoria/                  # CRUD protegido por rol y borrado lógico
│   ├── producto/                   # CRUD protegido por rol y borrado lógico
│   ├── ingrediente/                # CRUD protegido por rol y borrado lógico
│   ├── pedidos/                    # Creación por user/admin con usuario_id de la sesión
│   └── main.py                     # Punto de entrada para uvicorn app.main:app
├── main.py                         # Configuración FastAPI, CORS con credenciales y routers
├── .env.example                    # Plantilla de variables de entorno
└── requirements.txt
```

---

## 🔐 Seguridad, Roles y Reglas de Negocio

1. **Autenticación con JWT en Cookie HttpOnly (`/api/v1/auth`):**
   - `POST /api/v1/auth/register`: Público. Registra un usuario con contraseña hasheada con `bcrypt` (mínimo 8 caracteres) y le asigna automáticamente el rol `user` en `UsuarioRol`.
   - `POST /api/v1/auth/token`: Recibe credenciales en formulario OAuth2 (`username` = email, `password`), valida el usuario activo y emite el JWT en la cookie HttpOnly `access_token`.
   - `POST /api/v1/auth/logout`: Elimina la cookie `access_token` del navegador.
   - `GET /api/v1/auth/me`: Devuelve el perfil público (`UserPublic`) y los roles vigentes del usuario autenticado.

2. **Administración de Usuarios (`/api/v1/admin/usuarios`):**
   - `GET /api/v1/admin/usuarios`: Exclusivo para `admin`. Lista todos los usuarios indicando su estado y roles.
   - `POST /api/v1/admin/usuarios/{id}/desactivar`: Exclusivo para `admin`. Completa `deleted_at` con la fecha actual. Un usuario desactivado recibe `400 «Cuenta de usuario desactivada»` al intentar iniciar sesión o acceder a rutas protegidas.
   - `POST /api/v1/admin/usuarios/{id}/activar`: Exclusivo para `admin`. Restablece `deleted_at` a `None`.

3. **Control de Acceso Basado en Roles (RBAC):**
   - Lecturas (`GET`) disponibles para cualquier usuario autenticado activo (`get_current_active_user`).
   - Escrituras (`POST`, `PUT`, `PATCH`, `DELETE`) sobre categorías, productos, asignación de categorías e ingredientes restringidas al rol `admin` mediante `require_role(["admin"])`, verificando roles vigentes (`expires_at` nulo o futuro).
   - Creación de pedidos (`POST /api/v1/pedidos`) permitida para usuarios con rol `user` o `admin`, tomando el `usuario_id` directamente de la sesión.

4. **Borrado Lógico (`deleted_at`):**
   - Las bajas sobre entidades con auditoría marcan `deleted_at` con la fecha y hora actual sin eliminar físicamente las filas, y los listados excluyen los registros con `deleted_at` no nulo.

---

## ⚙️ Instalación y Ejecución

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### Usuarios Iniciales (Seed)
- **Administrador:** `admin@foodstore.com` / `admin1234`
- **Usuario estándar:** `user@foodstore.com` / `user1234`
