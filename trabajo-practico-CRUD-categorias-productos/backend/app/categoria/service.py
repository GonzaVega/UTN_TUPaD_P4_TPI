from typing import List
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlmodel import Session, select
from app.categoria.model import Categoria, ProductoCategoria
from app.categoria.schema import CategoriaCreate, CategoriaUpdate


def crear_categoria(session: Session, data: CategoriaCreate) -> Categoria:
    """Crea una nueva categoría validando que el nombre no esté duplicado."""
    nombre_normalizado = data.nombre.strip()
    existente = session.exec(
        select(Categoria).where(func.lower(Categoria.nombre) == func.lower(nombre_normalizado))
    ).first()

    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe una categoría registrada con el nombre '{nombre_normalizado}'."
        )

    nueva_categoria = Categoria(
        nombre=nombre_normalizado,
        descripcion=data.descripcion.strip() if data.descripcion else None
    )

    session.add(nueva_categoria)
    session.commit()
    session.refresh(nueva_categoria)
    return nueva_categoria


def obtener_todas(session: Session) -> List[Categoria]:
    """Retorna todas las categorías ordenadas por id."""
    query = select(Categoria).order_by(Categoria.id)
    return list(session.exec(query).all())


def obtener_por_id(session: Session, id: int) -> Categoria:
    """Retorna una categoría por su ID único. Lanza 404 si no existe."""
    categoria = session.get(Categoria, id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con id {id} no encontrada."
        )
    return categoria


def actualizar_categoria(session: Session, id: int, data: CategoriaUpdate) -> Categoria:
    """Actualiza una categoría existente verificando que no se repita el nombre."""
    categoria = obtener_por_id(session, id)

    datos = data.model_dump(exclude_unset=True)

    if "nombre" in datos and datos["nombre"]:
        nuevo_nombre = datos["nombre"].strip()
        existente = session.exec(
            select(Categoria).where(
                func.lower(Categoria.nombre) == func.lower(nuevo_nombre),
                Categoria.id != id
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
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


def eliminar_categoria(session: Session, id: int) -> dict:
    """Elimina una categoría y sus enlaces en la tabla intermedia."""
    categoria = obtener_por_id(session, id)

    # Limpiar posibles asociaciones en producto_categoria
    enlaces = session.exec(
        select(ProductoCategoria).where(ProductoCategoria.categoria_id == id)
    ).all()
    for enlace in enlaces:
        session.delete(enlace)

    session.delete(categoria)
    session.commit()
    return {"message": f"Categoría con id {id} eliminada correctamente."}
