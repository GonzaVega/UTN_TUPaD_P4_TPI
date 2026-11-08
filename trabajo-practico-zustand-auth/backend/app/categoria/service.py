from datetime import datetime, timezone
from typing import List
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlmodel import Session, select
from app.categoria.model import Categoria
from app.categoria.schema import CategoriaCreate, CategoriaUpdate


def crear_categoria(session: Session, data: CategoriaCreate) -> Categoria:
    nombre_normalizado = data.nombre.strip()
    activa = session.exec(
        select(Categoria).where(
            func.lower(Categoria.nombre) == func.lower(nombre_normalizado),
            Categoria.deleted_at.is_(None)
        )
    ).first()

    if activa:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe una categoría registrada con el nombre '{nombre_normalizado}'."
        )

    inactiva = session.exec(
        select(Categoria).where(
            func.lower(Categoria.nombre) == func.lower(nombre_normalizado),
            Categoria.deleted_at.is_not(None)
        )
    ).first()

    if inactiva:
        inactiva.deleted_at = None
        inactiva.activo = True
        inactiva.descripcion = data.descripcion.strip() if data.descripcion else None
        inactiva.updated_at = datetime.now(timezone.utc)
        session.add(inactiva)
        session.commit()
        session.refresh(inactiva)
        return inactiva

    nueva_categoria = Categoria(
        nombre=nombre_normalizado,
        descripcion=data.descripcion.strip() if data.descripcion else None,
        activo=True,
        deleted_at=None,
    )

    session.add(nueva_categoria)
    session.commit()
    session.refresh(nueva_categoria)
    return nueva_categoria


def obtener_todas(session: Session) -> List[Categoria]:
    query = select(Categoria).where(Categoria.deleted_at.is_(None)).order_by(Categoria.id)
    return list(session.exec(query).all())


def obtener_por_id(session: Session, id: int) -> Categoria:
    categoria = session.get(Categoria, id)
    if not categoria or categoria.deleted_at is not None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con id {id} no encontrada."
        )
    return categoria


def actualizar_categoria(session: Session, id: int, data: CategoriaUpdate) -> Categoria:
    categoria = obtener_por_id(session, id)

    datos = data.model_dump(exclude_unset=True)

    if "nombre" in datos and datos["nombre"]:
        nuevo_nombre = datos["nombre"].strip()
        existente = session.exec(
            select(Categoria).where(
                func.lower(Categoria.nombre) == func.lower(nuevo_nombre),
                Categoria.id != id,
                Categoria.deleted_at.is_(None)
            )
        ).first()

        if existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe otra categoría registrada con el nombre '{nuevo_nombre}'."
            )
        datos["nombre"] = nuevo_nombre

    if "descripcion" in datos and datos["descripcion"] is not None:
        datos["descripcion"] = datos["descripcion"].strip()

    categoria.sqlmodel_update(datos)
    categoria.updated_at = datetime.now(timezone.utc)
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


def eliminar_categoria(session: Session, id: int) -> dict:
    categoria = obtener_por_id(session, id)
    categoria.activo = False
    categoria.deleted_at = datetime.now(timezone.utc)
    categoria.updated_at = datetime.now(timezone.utc)
    session.add(categoria)
    session.commit()
    return {"message": f"Categoría con id {id} eliminada correctamente (soft delete)."}
