from datetime import datetime, timezone
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlmodel import Session, select
from app.modules.categorias.model import Categoria
from app.modules.categorias.schema import CategoriaCreate, CategoriaUpdate


def crear_categoria(session: Session, data: CategoriaCreate) -> Categoria:
    nombre_limpio = data.nombre.strip()

    existente = session.exec(
        select(Categoria).where(
            func.lower(Categoria.nombre) == func.lower(nombre_limpio),
            Categoria.activo == True
        )
    ).first()

    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe una categoría activa con el nombre '{nombre_limpio}'."
        )

    nueva_cat = Categoria(
        nombre=nombre_limpio,
        descripcion=data.descripcion.strip() if data.descripcion else None,
        activo=True,
        anulado_at=None
    )
    session.add(nueva_cat)
    session.commit()
    session.refresh(nueva_cat)
    return nueva_cat


def listar_categorias(
    session: Session,
    activo: Optional[bool] = None,
    search: Optional[str] = None
) -> List[Categoria]:
    query = select(Categoria)

    if activo is None or activo is True:
        query = query.where(Categoria.activo == True)
    else:
        query = query.where(Categoria.activo == False)

    if search:
        query = query.where(Categoria.nombre.ilike(f"%{search.strip()}%"))

    query = query.order_by(Categoria.id)
    return list(session.exec(query).all())


def obtener_categoria_por_id(session: Session, id: int) -> Categoria:
    categoria = session.get(Categoria, id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con id {id} no encontrada."
        )
    return categoria


def actualizar_categoria(session: Session, id: int, data: CategoriaUpdate) -> Categoria:
    categoria = session.get(Categoria, id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con id {id} no encontrada."
        )

    if not categoria.activo:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"La categoría con id {id} se encuentra anulada y no puede modificarse."
        )

    nombre_limpio = data.nombre.strip()

    existente = session.exec(
        select(Categoria).where(
            func.lower(Categoria.nombre) == func.lower(nombre_limpio),
            Categoria.id != id,
            Categoria.activo == True
        )
    ).first()

    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe otra categoría activa con el nombre '{nombre_limpio}'."
        )

    categoria.nombre = nombre_limpio
    categoria.descripcion = data.descripcion.strip() if data.descripcion else None

    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


def anular_categoria(session: Session, id: int) -> None:
    categoria = session.get(Categoria, id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con id {id} no encontrada."
        )

    if not categoria.activo:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"La categoría con id {id} ya se encuentra anulada."
        )

    categoria.activo = False
    categoria.anulado_at = datetime.now(timezone.utc)

    session.add(categoria)
    session.commit()
