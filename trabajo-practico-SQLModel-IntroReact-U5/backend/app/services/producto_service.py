from typing import List, Optional
from fastapi import HTTPException, status
from sqlmodel import Session, select
from sqlalchemy import func
from app.models.producto import Producto
from app.schemas.producto import ProductoCreate, ProductoUpdate


def crear_producto(session: Session, data: ProductoCreate) -> Producto:
    """
    Crea un nuevo producto en la base de datos PostgreSQL.
    Regla de negocio (HU-02): Si ya existe un producto con el mismo nombre, lanza 409 Conflict.
    RN-05: Persiste los cambios mediante sesión SQLModel.
    """
    # Verificación de unicidad de nombre (case-insensitive)
    nombre_normalizado = data.nombre.strip()
    existente = session.exec(
        select(Producto).where(func.lower(Producto.nombre) == func.lower(nombre_normalizado))
    ).first()

    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un producto registrado con el nombre '{nombre_normalizado}'."
        )

    # Transformación del esquema de entrada al modelo de base de datos
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
    """Obtiene la lista paginada de productos desde la base de datos."""
    query = select(Producto)
    if categoria:
        query = query.where(Producto.categoria == categoria)
    query = query.offset(skip).limit(limit)
    return list(session.exec(query).all())


def obtener_por_id(session: Session, id: int) -> Producto:
    """
    Obtiene un producto por su clave primaria.
    RN-04: Si el id no existe, devuelve 404 Not Found.
    """
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {id} no encontrado."
        )
    return producto


def actualizar_producto(session: Session, id: int, data: ProductoUpdate) -> Producto:
    """
    Actualiza los datos de un producto existente.
    RN-04: Si el id no existe, devuelve 404 Not Found.
    HU-02: Si se cambia el nombre y entra en conflicto con otro producto, lanza 409 Conflict.
    RN-05: Persiste con session.commit().
    """
    producto = obtener_por_id(session, id)

    datos_actualizacion = data.model_dump(exclude_unset=True)

    # Validar unicidad si se actualiza el nombre
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
    """
    Eliminación física del producto en PostgreSQL.
    RN-04: Si el id no existe, devuelve 404 Not Found.
    RN-05: Persiste la eliminación en la base de datos.
    """
    producto = obtener_por_id(session, id)
    session.delete(producto)
    session.commit()
    return {"message": f"Producto con id {id} eliminado correctamente de la base de datos."}


def desactivar_producto(session: Session, id: int) -> Producto:
    """
    Borrado lógico: cambia el estado activo a False.
    Mantiene compatibilidad con la operación desarrollada en TP4.
    """
    producto = obtener_por_id(session, id)
    producto.activo = False
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


def obtener_estado_stock(session: Session, id: int) -> dict:
    """
    Regla de negocio: evalúa si el stock actual se encuentra por debajo del stock mínimo.
    """
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
