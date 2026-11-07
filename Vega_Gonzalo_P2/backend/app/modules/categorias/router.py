from typing import List, Optional
from fastapi import APIRouter, Path, Query, status
from app.core.database import SessionDep
from app.modules.categorias.schema import CategoriaCreate, CategoriaPublic, CategoriaUpdate
from app.modules.categorias import service

router = APIRouter(prefix="/categorias", tags=["Categorías"])


@router.post(
    "",
    response_model=CategoriaPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Crear una categoría",
    description="Registra una nueva categoría en el sistema validando unicidad entre activas."
)
def crear_categoria(data: CategoriaCreate, session: SessionDep):
    return service.crear_categoria(session, data)


@router.get(
    "",
    response_model=List[CategoriaPublic],
    status_code=status.HTTP_200_OK,
    summary="Listar categorías",
    description="Lista categorías admitiendo filtros por estado activo y búsqueda por texto en nombre."
)
def listar_categorias(
    session: SessionDep,
    activo: Optional[bool] = Query(default=None, description="Omitido o true devuelve activas; false devuelve anuladas"),
    search: Optional[str] = Query(default=None, description="Coincidencia parcial sobre el nombre")
):
    return service.listar_categorias(session, activo=activo, search=search)


@router.get(
    "/{id}",
    response_model=CategoriaPublic,
    status_code=status.HTTP_200_OK,
    summary="Detalle de una categoría",
    description="Retorna el detalle de una categoría por su ID."
)
def obtener_categoria(
    session: SessionDep,
    id: int = Path(..., gt=0, description="ID único de la categoría")
):
    return service.obtener_categoria_por_id(session, id)


@router.put(
    "/{id}",
    response_model=CategoriaPublic,
    status_code=status.HTTP_200_OK,
    summary="Actualizar una categoría",
    description="Actualiza nombre y descripción de una categoría activa."
)
def actualizar_categoria(
    session: SessionDep,
    data: CategoriaUpdate,
    id: int = Path(..., gt=0, description="ID único de la categoría")
):
    return service.actualizar_categoria(session, id, data)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Anular una categoría",
    description="Realiza la baja lógica de la categoría fijando activo = false y marca de tiempo."
)
def anular_categoria(
    session: SessionDep,
    id: int = Path(..., gt=0, description="ID único de la categoría")
):
    service.anular_categoria(session, id)
    return None

