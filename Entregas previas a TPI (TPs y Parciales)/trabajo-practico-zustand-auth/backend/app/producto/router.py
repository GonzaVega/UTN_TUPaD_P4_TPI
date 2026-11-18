from typing import List
from fastapi import APIRouter, Depends, Path, status
from app.core.database import SessionDep
from app.core.deps import get_current_active_user, require_role
from app.categoria.schema import CategoriaRead
from app.producto.schema import (
    ProductoCreate,
    ProductoRead,
    ProductoUpdate,
    ProductoConCategoriasRead
)
from app.producto import service

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.post(
    "",
    response_model=ProductoRead,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
@router.post(
    "/",
    response_model=ProductoRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un nuevo producto",
    description="Registra un producto en la base de datos validando sus campos y unicidad de nombre."
)
def crear_producto(
    data: ProductoCreate,
    session: SessionDep,
    _: object = Depends(require_role(["admin"])),
):
    return service.crear_producto(session, data)


@router.get(
    "",
    response_model=List[ProductoConCategoriasRead],
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
@router.get(
    "/",
    response_model=List[ProductoConCategoriasRead],
    status_code=status.HTTP_200_OK,
    summary="Listar todos los productos",
    description="Retorna el listado completo de productos registrados con sus categorías asociadas."
)
def listar_productos(
    session: SessionDep,
    _: object = Depends(get_current_active_user),
):
    return service.obtener_todos(session)


@router.get(
    "/{id}",
    response_model=ProductoConCategoriasRead,
    status_code=status.HTTP_200_OK,
    summary="Detalle de producto con categorías",
    description="Retorna los datos de un producto junto con sus categorías asociadas (N:N)."
)
def obtener_producto(
    session: SessionDep,
    id: int = Path(..., gt=0, description="Identificador único del producto"),
    _: object = Depends(get_current_active_user),
):
    return service.obtener_por_id_con_categorias(session, id)


@router.patch(
    "/{id}",
    response_model=ProductoRead,
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
@router.put(
    "/{id}",
    response_model=ProductoRead,
    status_code=status.HTTP_200_OK,
    summary="Actualizar producto",
    description="Actualiza campos del producto especificado por su ID."
)
def actualizar_producto(
    session: SessionDep,
    data: ProductoUpdate,
    id: int = Path(..., gt=0, description="Identificador único del producto"),
    _: object = Depends(require_role(["admin"])),
):
    return service.actualizar_producto(session, id, data)


@router.delete(
    "/{id}",
    status_code=status.HTTP_200_OK,
    summary="Eliminar producto",
    description="Elimina lógicamente el producto marcando deleted_at."
)
def eliminar_producto(
    session: SessionDep,
    id: int = Path(..., gt=0, description="Identificador único del producto"),
    _: object = Depends(require_role(["admin"])),
):
    return service.eliminar_producto(session, id)


@router.post(
    "/{id}/categorias/{categoria_id}",
    status_code=status.HTTP_201_CREATED,
    summary="Asociar producto a una categoría",
    description="Crea un vínculo en la tabla intermedia validando existencia previa (404) y duplicados (409)."
)
def asociar_producto_categoria(
    session: SessionDep,
    id: int = Path(..., gt=0, description="ID del producto"),
    categoria_id: int = Path(..., gt=0, description="ID de la categoría a vincular"),
    _: object = Depends(require_role(["admin"])),
):
    return service.asociar_categoria(session, producto_id=id, categoria_id=categoria_id)


@router.delete(
    "/{id}/categorias/{categoria_id}",
    status_code=status.HTTP_200_OK,
    summary="Desasociar producto de una categoría",
    description="Elimina el vínculo correspondiente de la tabla intermedia."
)
def desasociar_producto_categoria(
    session: SessionDep,
    id: int = Path(..., gt=0, description="ID del producto"),
    categoria_id: int = Path(..., gt=0, description="ID de la categoría a desvincular"),
    _: object = Depends(require_role(["admin"])),
):
    return service.desasociar_categoria(session, producto_id=id, categoria_id=categoria_id)


@router.get(
    "/{id}/categorias",
    response_model=List[CategoriaRead],
    status_code=status.HTTP_200_OK,
    summary="Listar categorías de un producto",
    description="Retorna todas las categorías asignadas a un producto."
)
def listar_categorias_de_producto(
    session: SessionDep,
    id: int = Path(..., gt=0, description="ID del producto"),
    _: object = Depends(get_current_active_user),
):
    return service.obtener_categorias_de_producto(session, id)
