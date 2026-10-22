from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import init_db
import app.categoria.model
import app.producto.model
from app.categoria.router import router as categoria_router
from app.producto.router import router as producto_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicialización de la base de datos y creación de tablas
    init_db()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="API Catálogo de Productos y Categorías (Server State & Routing)",
        description="Trabajo Práctico 7 (UTN - Programación IV): Conexión Full Stack con TanStack Query y Enrutamiento con React Router.",
        version="1.0.0",
        lifespan=lifespan,
    )

    # Configuración de CORS para permitir consumo desde el frontend React
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Inclusión de routers modulares
    app.include_router(categoria_router)
    app.include_router(producto_router)

    @app.get("/", tags=["Root"])
    def root():
        return {
            "mensaje": "API TP7: Catálogo de Productos y Categorías activa.",
            "documentacion": "/docs",
            "redoc": "/redoc"
        }

    return app


app = create_app()
