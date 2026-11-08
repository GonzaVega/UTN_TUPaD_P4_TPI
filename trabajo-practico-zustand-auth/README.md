# TP9: Estado Global con Zustand y Autenticación

Trabajo Práctico Integrador de la **Unidad 9 — Programación IV (UTN - TUPaD)**. Extiende la aplicación Full Stack del Food Store incorporando autenticación con **JWT en cookie HttpOnly**, control de acceso basado en roles (**RBAC**: `user` y `admin`), **borrado lógico (`deleted_at`)** en el backend, y gestión de estado global de sesión con **Zustand (`persist`)**, **Axios con interceptores** y **rutas protegidas** en el frontend.

---

## 📂 Estructura General

- [`backend/`](./backend/README.md): API RESTful con FastAPI, SQLModel, JWT en cookies HttpOnly, `get_current_user`, `get_current_active_user`, `require_role`, borrado lógico y script `seed.py`.
- [`frontend/`](./frontend/README.md): SPA en React 19 + TypeScript, `axiosInstance` con `withCredentials: true`, `useAuthStore` con Zustand y `persist` (sin guardar el token), formularios con TanStack Form, `ProtectedRoute` y vistas condicionales según rol.

---

## 🚀 Puesta en Marcha Rápida

### 1. Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### 2. Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

### Credenciales de Prueba (generadas por `seed.py`)
- **Admin:** `admin@foodstore.com` / `admin1234`
- **Usuario:** `user@foodstore.com` / `user1234`
