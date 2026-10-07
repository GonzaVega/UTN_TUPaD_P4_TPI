from typing import List
from fastapi import APIRouter, Path, status
from app.core.database import SessionDep
from app.categoria.schema import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.categoria import service

router = APIRouter(prefix="/categorias", tags=["Categorías"])


@router.post(
    "/",
    response_model=CategoriaRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear una nueva categoría",
    description="Registra una nueva categoría en la base de datos validando que el nombre no esté duplicado."
)
def crear_categoria(data: CategoriaCreate, session: SessionDep):
    return service.crear_categoria(session, data)


@router.get(
    "/",
    response_model=List[CategoriaRead],
    status_code=status.HTTP_200_OK,
    summary="Listar todas las categorías",
    description="Retorna el listado completo de categorías disponibles."
)
def listar_categorias(session: SessionDep):
    return service.obtener_todas(session)


@router.get(
    "/{id}",
    response_model=CategoriaRead,
    status_code=status.HTTP_200_OK,
    summary="Obtener categoría por ID",
    description="Retorna los datos de una categoría puntual por su identificador único."
)
def obtener_categoria(
    session: SessionDep,
    id: int = Path(..., gt=0, description="Identificador único de la categoría")
):
    return service.obtener_por_id(session, id)


@router.put(
    "/{id}",
    response_model=CategoriaRead,
    status_code=status.HTTP_200_OK,
    summary="Actualizar categoría",
    description="Modifica los campos de una categoría existente por su ID."
)
def actualizar_categoria(
    session: SessionDep,
    data: CategoriaUpdate,
    id: int = Path(..., gt=0, description="Identificador único de la categoría a actualizar")
):
    return service.actualizar_categoria(session, id, data)


@router.delete(
    "/{id}",
    status_code=status.HTTP_200_OK,
    summary="Eliminar categoría",
    description="Elimina la categoría de la base de datos y sus vínculos existentes."
)
def eliminar_categoria(
    session: SessionDep,
    id: int = Path(..., gt=0, description="Identificador único de la categoría a eliminar")
):
    return service.eliminar_categoria(session, id)
