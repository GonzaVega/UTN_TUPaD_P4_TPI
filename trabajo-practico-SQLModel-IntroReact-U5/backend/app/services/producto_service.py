from typing import List, Optional
from fastapi import HTTPException, status
from sqlmodel import Session, select
from sqlalchemy import func
from app.models.producto import Producto
from app.schemas.producto import ProductoCreate, ProductoUpdate


def crear_producto(session: Session, data: ProductoCreate) -> Producto:
    nombre_normalizado = data.nombre.strip()
    existente = session.exec(
        select(Producto).where(func.lower(Producto.nombre) == func.lower(nombre_normalizado))
    ).first()

    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un producto registrado con el nombre '{nombre_normalizado}'."
        )

    nuevo_producto = Producto(**data.model_dump())
    nuevo_producto.nombre = nombre_normalizado

    session.add(nuevo_producto)
    session.commit()
    session.refresh(nuevo_producto)
    return nuevo_producto


def obtener_todos(
    session: Session,
    skip: int = 0,
    limit: int = 10,
    categoria: Optional[str] = None
) -> List[Producto]:
    query = select(Producto)
    if categoria:
        query = query.where(Producto.categoria == categoria)
    query = query.offset(skip).limit(limit)
    return list(session.exec(query).all())


def obtener_por_id(session: Session, id: int) -> Producto:
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {id} no encontrado."
        )
    return producto


def actualizar_producto(session: Session, id: int, data: ProductoUpdate) -> Producto:
    producto = obtener_por_id(session, id)

    datos_actualizacion = data.model_dump(exclude_unset=True)

    if "nombre" in datos_actualizacion and datos_actualizacion["nombre"]:
        nuevo_nombre = datos_actualizacion["nombre"].strip()
        existente = session.exec(
            select(Producto).where(
                func.lower(Producto.nombre) == func.lower(nuevo_nombre),
                Producto.id != id
            )
        ).first()
        if existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe otro producto registrado con el nombre '{nuevo_nombre}'."
            )
        datos_actualizacion["nombre"] = nuevo_nombre

    producto.sqlmodel_update(datos_actualizacion)
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


def eliminar_producto(session: Session, id: int) -> dict:
    producto = obtener_por_id(session, id)
    session.delete(producto)
    session.commit()
    return {"message": f"Producto con id {id} eliminado correctamente de la base de datos."}


def desactivar_producto(session: Session, id: int) -> Producto:
    producto = obtener_por_id(session, id)
    producto.activo = False
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


def obtener_estado_stock(session: Session, id: int) -> dict:
    producto = obtener_por_id(session, id)
    alerta_stock = producto.stock < producto.stock_minimo

    return {
        "id": producto.id,
        "nombre": producto.nombre,
        "stock": producto.stock,
        "stock_minimo": producto.stock_minimo,
        "bajo_stock_minimo": alerta_stock,
        "activo": producto.activo,
    }
