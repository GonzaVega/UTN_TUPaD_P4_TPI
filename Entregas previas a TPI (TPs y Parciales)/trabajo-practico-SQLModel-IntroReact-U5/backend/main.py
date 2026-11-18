from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db_and_tables
import app.models
from app.routers import producto_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="Gestor de Productos - API con SQLModel",
        description="TP Integrador Unidad 5: Persistencia en PostgreSQL con SQLModel y FastAPI.",
        version="1.0.0",
        lifespan=lifespan,
    )

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
