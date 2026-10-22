from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session
from app.core.database import engine
from app.pedidos.exceptions import (
    ConflictoEstadoPedido,
    EstadoInvalido,
    PedidoInvalido,
    PedidoNoEncontrado,
    ProductoNoEncontrado,
)
from app.pedidos.schemas import (
    PedidoCreate,
    PedidoDetailRead,
    PedidoRead,
    PedidoUpdateEstado,
)
from app.pedidos.service import PedidoService
from app.pedidos.unit_of_work import PedidoUnitOfWork

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


def get_pedido_service() -> PedidoService:
    def session_factory() -> Session:
        return Session(engine)

    return PedidoService(PedidoUnitOfWork(session_factory))


@router.post(
    "",
    response_model=PedidoDetailRead,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
@router.post(
    "/",
    response_model=PedidoDetailRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un pedido y sus detalles en transacción atómica (UoW)",
)
def create(
    data: PedidoCreate,
    service: PedidoService = Depends(get_pedido_service),
) -> PedidoDetailRead:
    try:
        return service.crear(data)
    except ProductoNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except (PedidoInvalido, ValueError) as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )


@router.get(
    "",
    response_model=List[PedidoRead],
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
@router.get(
    "/",
    response_model=List[PedidoRead],
    status_code=status.HTTP_200_OK,
    summary="Listar todos los pedidos no eliminados",
)
def get_all(
    service: PedidoService = Depends(get_pedido_service),
) -> List[PedidoRead]:
    return service.obtener_todos()


@router.get(
    "/{id}",
    response_model=PedidoDetailRead,
    status_code=status.HTTP_200_OK,
    summary="Obtener un pedido por ID con la lista de sus detalles",
)
def get_one(
    id: int,
    service: PedidoService = Depends(get_pedido_service),
) -> PedidoDetailRead:
    try:
        return service.obtener_por_id(id)
    except PedidoNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.put(
    "/{id}",
    response_model=PedidoRead,
    status_code=status.HTTP_200_OK,
    summary="Actualizar el estado de un pedido",
)
def update_estado(
    id: int,
    data: PedidoUpdateEstado,
    service: PedidoService = Depends(get_pedido_service),
) -> PedidoRead:
    try:
        return service.actualizar_estado(id, data.estado)
    except PedidoNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except ConflictoEstadoPedido as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )
    except (EstadoInvalido, ValueError) as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar un pedido (borrado lógico con deleted_at)",
)
def delete(
    id: int,
    service: PedidoService = Depends(get_pedido_service),
) -> Response:
    try:
        service.eliminar_logico(id)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except PedidoNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
