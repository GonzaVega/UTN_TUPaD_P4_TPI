from typing import List
from fastapi import APIRouter, Depends, status
from app.core.database import SessionDep
from app.core.deps import get_current_active_user, require_role
from app.ingrediente.schema import IngredienteCreate, IngredienteRead, IngredienteUpdate
from app.ingrediente.service import (
    actualizar_ingrediente,
    crear_ingrediente,
    eliminar_ingrediente,
    obtener_por_id,
    obtener_todos,
)

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])


@router.post(
    "",
    response_model=IngredienteRead,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
@router.post(
    "/",
    response_model=IngredienteRead,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar un nuevo ingrediente",
)
def create(
    data: IngredienteCreate,
    session: SessionDep,
    _: object = Depends(require_role(["admin"])),
) -> IngredienteRead:
    return crear_ingrediente(session, data)


@router.get(
    "",
    response_model=List[IngredienteRead],
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
@router.get(
    "/",
    response_model=List[IngredienteRead],
    status_code=status.HTTP_200_OK,
    summary="Listar todos los ingredientes activos",
)
def get_all(
    session: SessionDep,
    _: object = Depends(get_current_active_user),
) -> List[IngredienteRead]:
    return obtener_todos(session)


@router.get(
    "/{id}",
    response_model=IngredienteRead,
    status_code=status.HTTP_200_OK,
    summary="Obtener un ingrediente por ID",
)
def get_one(
    id: int,
    session: SessionDep,
    _: object = Depends(get_current_active_user),
) -> IngredienteRead:
    return obtener_por_id(session, id)


@router.patch(
    "/{id}",
    response_model=IngredienteRead,
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
@router.put(
    "/{id}",
    response_model=IngredienteRead,
    status_code=status.HTTP_200_OK,
    summary="Actualizar un ingrediente existente",
)
def update(
    id: int,
    data: IngredienteUpdate,
    session: SessionDep,
    _: object = Depends(require_role(["admin"])),
) -> IngredienteRead:
    return actualizar_ingrediente(session, id, data)


@router.delete(
    "/{id}",
    status_code=status.HTTP_200_OK,
    summary="Eliminar un ingrediente (borrado lógico)",
)
def delete(
    id: int,
    session: SessionDep,
    _: object = Depends(require_role(["admin"])),
) -> dict:
    return eliminar_ingrediente(session, id)
