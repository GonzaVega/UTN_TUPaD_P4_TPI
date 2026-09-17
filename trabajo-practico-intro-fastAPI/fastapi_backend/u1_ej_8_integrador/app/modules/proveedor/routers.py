from fastapi import APIRouter, HTTPException, Path, Query, status
from typing import List, Optional
from . import schemas, services

router = APIRouter(prefix="/proveedores", tags=["Proveedores"])


# ---------------------------------------------------------
# ALTA DE PROVEEDOR
# Método: POST | Endpoint: /proveedores | Estado: 201 Created
# ---------------------------------------------------------
@router.post(
    "/", response_model=schemas.ProveedorRead, status_code=status.HTTP_201_CREATED
)
def alta_proveedor(proveedor: schemas.ProveedorCreate):
    nuevo_proveedor = services.crear(proveedor)
    if not nuevo_proveedor:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Proveedor ya registrado"
        )
    return nuevo_proveedor


# ---------------------------------------------------------
# LISTAR PROVEEDORES
# Método: GET | Endpoint: /proveedores | Estado: 200 OK
# ---------------------------------------------------------
@router.get(
    "/", response_model=List[schemas.ProveedorRead], status_code=status.HTTP_200_OK
)
def listar_proveedores(skip: int = Query(0, ge=0),
                       limit: int = Query(10, ge=1, le=50),
                       activo: Optional[bool] = Query(None)):
    return services.obtener_todos(skip, limit, activo)


# ---------------------------------------------------------
# DETALLE DE PROVEEDOR
# Método: GET | Endpoint: /proveedores/{id} | Estado: 200 OK
# ---------------------------------------------------------
@router.get(
    "/{id}", response_model=schemas.ProveedorRead, status_code=status.HTTP_200_OK
)
def detalle_proveedor(id: int = Path(..., gt=0)):
    proveedor = services.obtener_por_id(id)
    if not proveedor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Proveedor no encontrado"
        )
    return proveedor


# ---------------------------------------------------------
# ACTUALIZACIÓN TOTAL
# Método: PUT | Endpoint: /proveedores/{id} | Estado: 200 OK
# ---------------------------------------------------------
@router.put(
    "/{id}", response_model=schemas.ProveedorRead, status_code=status.HTTP_200_OK
)
def actualizar_proveedor(proveedor: schemas.ProveedorCreate, id: int = Path(..., gt=0)):
    actualizado = services.actualizar_total(id, proveedor)
    if not actualizado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Proveedor no encontrado"
        )
    if actualizado == 'Codigo existente':
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Codigo existente"
        )
    return actualizado


# ---------------------------------------------------------
# BORRADO LÓGICO
# Método: PUT | Endpoint: /proveedores/{id}/desactivar | Estado: 200 OK
# ---------------------------------------------------------
@router.put(
    "/{id}/desactivar",
    response_model=schemas.ProveedorRead,
    status_code=status.HTTP_200_OK,
)
def borrado_logico(id: int = Path(..., gt=0)):
    desactivado = services.desactivar(id)
    if not desactivado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Proveedor no encontrado"
        )
    if desactivado == 'already_eliminated':
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Proveedor ya desactivado"
        )
    return desactivado
