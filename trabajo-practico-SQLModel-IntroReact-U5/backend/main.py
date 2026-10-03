from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db_and_tables
import app.models  # Asegura el registro de todos los modelos en SQLModel.metadata
from app.routers import producto_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Evento Startup: Creación automática de tablas en PostgreSQL si no existen
    create_db_and_tables()
    yield
    # Evento Shutdown (limpieza si fuera necesaria)


def create_app() -> FastAPI:
    app = FastAPI(
        title="Gestor de Productos - API con SQLModel",
        description="TP Integrador Unidad 5: Persistencia en PostgreSQL con SQLModel y FastAPI.",
        version="1.0.0",
        lifespan=lifespan,
    )

    # Configuración de CORS para permitir la comunicación con el frontend React (localhost:5173)
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

    # Registro de routers
    app.include_router(producto_router)

    @app.get("/", tags=["Root"])
    def root():
        return {
            "mensaje": "API Gestor de Productos en funcionamiento.",
            "documentacion": "/docs",
            "redoc": "/redoc"
        }

    return app


app = create_app()
