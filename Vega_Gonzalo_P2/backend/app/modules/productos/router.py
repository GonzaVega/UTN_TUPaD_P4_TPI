from typing import List, Optional
from fastapi import APIRouter, Path, Query, status
from app.core.database import SessionDep
from app.modules.productos.schema import (
    ProductoCreate,
    ProductoUpdate,
    ProductoPublic,
    CategoriaEnProductoPublic,
    ClasificarProductoRequest
)
from app.modules.productos import service

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.post(
    "",
    response_model=ProductoPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un producto",
    description="Crea un producto validando cuerpo, tipo de unidad para stock entero y unicidad de nombre."
)
def crear_producto(data: ProductoCreate, session: SessionDep):
    return service.crear_producto(session, data)


@router.get(
    "",
    response_model=List[ProductoPublic],
    status_code=status.HTTP_200_OK,
    summary="Listar productos con paginación y filtros",
    description="Lista productos con soporte para skip, limit, activo, disponible, categoria_id y search."
)
def listar_productos(
    session: SessionDep,
    skip: int = Query(default=0, ge=0, description="Cantidad de registros a omitir"),
    limit: int = Query(default=10, ge=1, le=50, description="Límite de registros por página"),
    activo: Optional[bool] = Query(default=None, description="Omitido o true devuelve activos; false devuelve anulados"),
    disponible: Optional[bool] = Query(default=None, description="Filtra por indicador disponible"),
    categoria_id: Optional[int] = Query(default=None, description="Filtra por ID de categoría"),
    search: Optional[str] = Query(default=None, description="Búsqueda parcial en el nombre sin distinguir mayúsculas")
):
    return service.listar_productos(
        session=session,
        skip=skip,
        limit=limit,
        activo=activo,
        disponible=disponible,
        categoria_id=categoria_id,
        search=search
    )


@router.get(
    "/{id}",
    response_model=ProductoPublic,
    status_code=status.HTTP_200_OK,
    summary="Detalle de un producto",
    description="Devuelve el producto con su unidad de venta, sus categorías, stock_cantidad y hay_stock."
)
def obtener_producto(
    session: SessionDep,
    id: int = Path(..., gt=0, description="ID del producto")
):
    return service.obtener_producto_por_id(session, id)


@router.put(
    "/{id}",
    response_model=ProductoPublic,
    status_code=status.HTTP_200_OK,
    summary="Actualizar un producto",
    description="Actualiza campos propios del producto. Falla con 409 si está anulado o 422 si stock tiene decimales en contables."
)
def actualizar_producto(
    session: SessionDep,
    data: ProductoUpdate,
    id: int = Path(..., gt=0, description="ID del producto")
):
    return service.actualizar_producto(session, id, data)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Anular un producto",
    description="Realiza la baja lógica: activo = false y anulado_at. Responde 204 y 409 si ya estaba anulado."
)
def anular_producto(
    session: SessionDep,
    id: int = Path(..., gt=0, description="ID del producto")
):
    service.anular_producto(session, id)
    return None


@router.post(
    "/{id}/categorias",
    response_model=CategoriaEnProductoPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Clasificar producto en una categoría",
    description="Asocia una categoría al producto indicando si es principal. Desmarca automáticamente la anterior."
)
def clasificar_producto(
    session: SessionDep,
    data: ClasificarProductoRequest,
    id: int = Path(..., gt=0, description="ID del producto")
):
    return service.clasificar_producto(session, producto_id=id, data=data)


@router.get(
    "/{id}/categorias",
    response_model=List[CategoriaEnProductoPublic],
    status_code=status.HTTP_200_OK,
    summary="Listar categorías del producto",
    description="Lista las categorías asociadas al producto indicando cuál es la principal."
)
def listar_categorias_de_producto(
    session: SessionDep,
    id: int = Path(..., gt=0, description="ID del producto")
):
    return service.listar_categorias_de_producto(session, producto_id=id)

