from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from app.core.database import engine, init_db
from app.core.seed import seed_database
import app.categoria.model
import app.producto.model
import app.ingrediente.model
import app.pedidos.models
import app.modules.usuarios.models
from app.categoria.router import router as categoria_router
from app.producto.router import router as producto_router
from app.ingrediente.router import router as ingrediente_router
from app.pedidos.router import router as pedido_router
from app.modules.usuarios.router import (
    admin_router as usuario_admin_router,
    auth_router,
    roles_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    with Session(engine) as session:
        seed_database(session)
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="Food Store API - TP9",
        description="Sistema de pedidos de comida con JWT en HttpOnly cookies y RBAC",
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

    app.include_router(auth_router)
    app.include_router(usuario_admin_router)
    app.include_router(roles_router)
    app.include_router(categoria_router)
    app.include_router(producto_router)
    app.include_router(ingrediente_router)
    app.include_router(pedido_router)

    api_prefix = "/api/v1"
    app.include_router(auth_router, prefix=api_prefix)
    app.include_router(usuario_admin_router, prefix=api_prefix)
    app.include_router(roles_router, prefix=api_prefix)
    app.include_router(categoria_router, prefix=api_prefix)
    app.include_router(producto_router, prefix=api_prefix)
    app.include_router(ingrediente_router, prefix=api_prefix)
    app.include_router(pedido_router, prefix=api_prefix)

    @app.get("/", tags=["Root"])
    def root():
        return {
            "mensaje": "Bienvenido a Food Store API - TP9",
            "documentacion": "/docs",
            "redoc": "/redoc",
            "version": "1.0.0",
        }

    return app


app = create_app()
