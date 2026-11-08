from datetime import datetime, timezone
from typing import List
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlmodel import Session, select
from app.ingrediente.model import Ingrediente
from app.ingrediente.schema import IngredienteCreate, IngredienteUpdate


def crear_ingrediente(session: Session, data: IngredienteCreate) -> Ingrediente:
    nombre_normalizado = data.nombre.strip()

    activo = session.exec(
        select(Ingrediente).where(
            func.lower(Ingrediente.nombre) == func.lower(nombre_normalizado),
            Ingrediente.deleted_at.is_(None),
        )
    ).first()

    if activo:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un ingrediente registrado con el nombre '{nombre_normalizado}'.",
        )

    inactivo = session.exec(
        select(Ingrediente).where(
            func.lower(Ingrediente.nombre) == func.lower(nombre_normalizado),
            Ingrediente.deleted_at.is_not(None),
        )
    ).first()

    if inactivo:
        inactivo.deleted_at = None
        inactivo.activo = True
        inactivo.updated_at = datetime.now(timezone.utc)
        session.add(inactivo)
        session.commit()
        session.refresh(inactivo)
        return inactivo

    nuevo_ingrediente = Ingrediente(
        nombre=nombre_normalizado,
        activo=True,
        deleted_at=None,
    )
    session.add(nuevo_ingrediente)
    session.commit()
    session.refresh(nuevo_ingrediente)
    return nuevo_ingrediente


def obtener_todos(session: Session) -> List[Ingrediente]:
    query = select(Ingrediente).where(Ingrediente.deleted_at.is_(None)).order_by(Ingrediente.id)
    return list(session.exec(query).all())


def obtener_por_id(session: Session, id: int) -> Ingrediente:
    ingrediente = session.get(Ingrediente, id)
    if not ingrediente or ingrediente.deleted_at is not None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ingrediente con id {id} no encontrado.",
        )
    return ingrediente


def actualizar_ingrediente(
    session: Session, id: int, data: IngredienteUpdate
) -> Ingrediente:
    ingrediente = obtener_por_id(session, id)
    datos = data.model_dump(exclude_unset=True)

    if "nombre" in datos and datos["nombre"]:
        nuevo_nombre = datos["nombre"].strip()
        existente = session.exec(
            select(Ingrediente).where(
                func.lower(Ingrediente.nombre) == func.lower(nuevo_nombre),
                Ingrediente.id != id,
                Ingrediente.deleted_at.is_(None),
            )
        ).first()

        if existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe otro ingrediente registrado con el nombre '{nuevo_nombre}'.",
            )
        datos["nombre"] = nuevo_nombre

    ingrediente.sqlmodel_update(datos)
    ingrediente.updated_at = datetime.now(timezone.utc)
    session.add(ingrediente)
    session.commit()
    session.refresh(ingrediente)
    return ingrediente


def eliminar_ingrediente(session: Session, id: int) -> dict:
    ingrediente = obtener_por_id(session, id)
    ingrediente.activo = False
    ingrediente.deleted_at = datetime.now(timezone.utc)
    ingrediente.updated_at = datetime.now(timezone.utc)
    session.add(ingrediente)
    session.commit()
    return {"message": f"Ingrediente con id {id} eliminado correctamente (soft delete)."}
