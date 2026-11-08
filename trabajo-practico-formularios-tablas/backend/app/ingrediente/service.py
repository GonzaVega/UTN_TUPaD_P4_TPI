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
            Ingrediente.activo == True,
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
            Ingrediente.activo == False,
        )
    ).first()

    if inactivo:
        inactivo.activo = True
        session.add(inactivo)
        session.commit()
        session.refresh(inactivo)
        return inactivo

    nuevo_ingrediente = Ingrediente(
        nombre=nombre_normalizado,
        activo=True,
    )
    session.add(nuevo_ingrediente)
    session.commit()
    session.refresh(nuevo_ingrediente)
    return nuevo_ingrediente


def obtener_todos(session: Session) -> List[Ingrediente]:
    query = select(Ingrediente).where(Ingrediente.activo == True).order_by(Ingrediente.id)
    return list(session.exec(query).all())


def obtener_por_id(session: Session, id: int) -> Ingrediente:
    ingrediente = session.get(Ingrediente, id)
    if not ingrediente or not ingrediente.activo:
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
                Ingrediente.activo == True,
            )
        ).first()

        if existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe otro ingrediente registrado con el nombre '{nuevo_nombre}'.",
            )
        datos["nombre"] = nuevo_nombre

    ingrediente.sqlmodel_update(datos)
    session.add(ingrediente)
    session.commit()
    session.refresh(ingrediente)
    return ingrediente


def eliminar_ingrediente(session: Session, id: int) -> dict:
    ingrediente = obtener_por_id(session, id)
    ingrediente.activo = False
    session.add(ingrediente)
    session.commit()
    return {"message": f"Ingrediente con id {id} eliminado correctamente (soft delete)."}
