from typing import List
from fastapi import APIRouter, status
from sqlmodel import select
from app.core.database import SessionDep
from app.modules.unidades_medida.model import UnidadMedida, UnidadMedidaPublic

router = APIRouter(prefix="/unidades-medida", tags=["Unidades de Medida"])


@router.get(
    "",
    response_model=List[UnidadMedidaPublic],
    status_code=status.HTTP_200_OK,
    summary="Listar unidades de medida",
    description="Devuelve el catálogo de solo lectura de unidades de medida (origen del selector de frontend)."
)
def listar_unidades_medida(session: SessionDep):
    unidades = session.exec(select(UnidadMedida).order_by(UnidadMedida.id)).all()
    return unidades

