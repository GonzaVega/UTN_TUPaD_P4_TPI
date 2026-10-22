from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import init_db
import app.categoria.model
import app.producto.model
import app.ingrediente.model
import app.pedidos.models
from app.categoria.router import router as categoria_router
from app.producto.router import router as producto_router
from app.ingrediente.router import router as ingrediente_router
from app.pedidos.router import router as pedido_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicialización de la base de datos y creación de tablas
    init_db()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="API Catálogo y Pedidos (Formularios y Tablas)",
        description="Trabajo Práctico 8 (UTN - Programación IV): Conexión Full Stack con TanStack Form, TanStack Table, TanStack Query y arquitectura UoW/Repository para Pedidos.",
        version="1.0.0",
        lifespan=lifespan,
    )

    # Configuración de CORS para permitir consumo desde el frontend React (Vite)
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
    app.include_router(ingrediente_router)
    app.include_router(pedido_router)

    @app.get("/", tags=["Root"])
    def root():
        return {
            "mensaje": "API TP8: Formularios y Tablas (Categorías, Productos, Ingredientes y Pedidos) activa.",
            "documentacion": "/docs",
            "redoc": "/redoc",
        }

    return app


app = create_app()
