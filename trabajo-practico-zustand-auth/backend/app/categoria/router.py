from typing import List
from fastapi import APIRouter, Depends, Path, status
from app.core.database import SessionDep
from app.core.deps import get_current_active_user, require_role
from app.categoria.schema import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.categoria import service

router = APIRouter(prefix="/categorias", tags=["Categorías"])


@router.post(
    "",
    response_model=CategoriaRead,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
@router.post(
    "/",
    response_model=CategoriaRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear una nueva categoría",
    description="Registra una nueva categoría en la base de datos validando que el nombre no esté duplicado."
)
def crear_categoria(
    data: CategoriaCreate,
    session: SessionDep,
    _: object = Depends(require_role(["admin"])),
):
    return service.crear_categoria(session, data)


@router.get(
    "",
    response_model=List[CategoriaRead],
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
@router.get(
    "/",
    response_model=List[CategoriaRead],
    status_code=status.HTTP_200_OK,
    summary="Listar todas las categorías",
    description="Retorna el listado completo de categorías disponibles."
)
def listar_categorias(
    session: SessionDep,
    _: object = Depends(get_current_active_user),
):
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
    id: int = Path(..., gt=0, description="Identificador único de la categoría"),
    _: object = Depends(get_current_active_user),
):
    return service.obtener_por_id(session, id)


@router.patch(
    "/{id}",
    response_model=CategoriaRead,
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
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
    id: int = Path(..., gt=0, description="Identificador único de la categoría a actualizar"),
    _: object = Depends(require_role(["admin"])),
):
    return service.actualizar_categoria(session, id, data)


@router.delete(
    "/{id}",
    status_code=status.HTTP_200_OK,
    summary="Eliminar categoría",
    description="Elimina la categoría de la base de datos (borrado lógico)."
)
def eliminar_categoria(
    session: SessionDep,
    id: int = Path(..., gt=0, description="Identificador único de la categoría a eliminar"),
    _: object = Depends(require_role(["admin"])),
):
    return service.eliminar_categoria(session, id)
