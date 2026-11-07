from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import init_db
from app.modules.unidades_medida.router import router as unidades_router
from app.modules.categorias.router import router as categorias_router
from app.modules.productos.router import router as productos_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="API Catálogo de Productos — Food Store",
        description="Segunda Evaluación Parcial (UTN - Programación IV): API REST con FastAPI, SQLModel y PostgreSQL.",
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

    app.include_router(unidades_router, prefix="/api/v1")
    app.include_router(categorias_router, prefix="/api/v1")
    app.include_router(productos_router, prefix="/api/v1")

    @app.get("/", tags=["Root"])
    def root():
        return {
            "mensaje": "API Food Store — Catálogo de Productos activa.",
            "documentacion": "/docs",
            "redoc": "/redoc",
        }

    return app


app = create_app()
