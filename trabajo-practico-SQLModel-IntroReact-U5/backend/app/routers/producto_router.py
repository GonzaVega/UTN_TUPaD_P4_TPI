from typing import List, Optional
from fastapi import APIRouter, Path, Query, status
from database import SessionDep
from app.schemas.producto import (
    ProductoCreate,
    ProductoUpdate,
    ProductoResponse,
    ProductoStockResponse,
)
from app.services import producto_service

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.post(
    "/",
    response_model=ProductoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un nuevo producto",
    description="Registra un producto en PostgreSQL validando campos con Pydantic y reglas de negocio."
)
def alta_producto(producto: ProductoCreate, session: SessionDep):
    return producto_service.crear_producto(session, producto)


@router.get(
    "/",
    response_model=List[ProductoResponse],
    status_code=status.HTTP_200_OK,
    summary="Listar productos",
    description="Retorna una lista paginada de productos con filtros opcionales."
)
def listar_productos(
    session: SessionDep,
    skip: int = Query(0, ge=0, description="Cantidad de registros a omitir"),
    limit: int = Query(10, ge=1, le=100, description="Límite de registros por página"),
    categoria: Optional[str] = Query(None, description="Filtrar por categoría")
):
    return producto_service.obtener_todos(session, skip=skip, limit=limit, categoria=categoria)


@router.get(
    "/{id}",
    response_model=ProductoResponse,
    status_code=status.HTTP_200_OK,
    summary="Detalle de producto",
    description="Consulta un producto por su ID único. Lanza 404 si no existe."
)
def detalle_producto(
    session: SessionDep,
    id: int = Path(..., gt=0, description="Identificador único del producto")
):
    return producto_service.obtener_por_id(session, id)


@router.put(
    "/{id}",
    response_model=ProductoResponse,
    status_code=status.HTTP_200_OK,
    summary="Actualizar producto",
    description="Actualiza campos del producto especificado por ID."
)
def actualizar_producto(
    session: SessionDep,
    producto: ProductoUpdate,
    id: int = Path(..., gt=0, description="Identificador único del producto a actualizar")
):
    return producto_service.actualizar_producto(session, id, producto)


@router.delete(
    "/{id}",
    status_code=status.HTTP_200_OK,
    summary="Eliminar producto",
    description="Elimina físicamente el producto de la base de datos PostgreSQL."
)
def eliminar_producto(
    session: SessionDep,
    id: int = Path(..., gt=0, description="Identificador único del producto a eliminar")
):
    return producto_service.eliminar_producto(session, id)


@router.put(
    "/{id}/desactivar",
    response_model=ProductoResponse,
    status_code=status.HTTP_200_OK,
    summary="Borrado lógico de producto",
    description="Desactiva el producto cambiando su atributo activo a False."
)
def borrado_logico(
    session: SessionDep,
    id: int = Path(..., gt=0, description="Identificador único del producto a desactivar")
):
    return producto_service.desactivar_producto(session, id)


@router.get(
    "/{id}/stock",
    response_model=ProductoStockResponse,
    status_code=status.HTTP_200_OK,
    summary="Consultar alerta de stock",
    description="Verifica si el stock actual está por debajo del stock mínimo configurado."
)
def consultar_stock(
    session: SessionDep,
    id: int = Path(..., gt=0, description="Identificador único del producto")
):
    return producto_service.obtener_estado_stock(session, id)
