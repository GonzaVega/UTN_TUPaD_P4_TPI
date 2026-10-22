from typing import List
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlmodel import Session, select
from app.categoria.model import Categoria, ProductoCategoria
from app.producto.model import Producto
from app.producto.schema import ProductoCreate, ProductoUpdate


def crear_producto(session: Session, data: ProductoCreate) -> Producto:
    nombre_normalizado = data.nombre.strip()
    activo = session.exec(
        select(Producto).where(
            func.lower(Producto.nombre) == func.lower(nombre_normalizado),
            Producto.activo == True
        )
    ).first()

    if activo:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un producto registrado con el nombre '{nombre_normalizado}'."
        )

    # Si existía previamente dado de baja (soft deleted), se reactiva
    inactivo = session.exec(
        select(Producto).where(
            func.lower(Producto.nombre) == func.lower(nombre_normalizado),
            Producto.activo == False
        )
    ).first()

    if inactivo:
        inactivo.activo = True
        inactivo.descripcion = data.descripcion.strip() if data.descripcion else None
        inactivo.precio_base = data.precio_base
        inactivo.imagen_url = data.imagen_url.strip() if data.imagen_url else None
        inactivo.disponible = data.disponible
        session.add(inactivo)
        session.commit()
        session.refresh(inactivo)
        return inactivo

    nuevo_producto = Producto(
        nombre=nombre_normalizado,
        descripcion=data.descripcion.strip() if data.descripcion else None,
        precio_base=data.precio_base,
        imagen_url=data.imagen_url.strip() if data.imagen_url else None,
        disponible=data.disponible,
        activo=True
    )

    session.add(nuevo_producto)
    session.commit()
    session.refresh(nuevo_producto)
    return nuevo_producto


def obtener_todos(session: Session) -> List[Producto]:
    query = select(Producto).where(Producto.activo == True).order_by(Producto.id)
    return list(session.exec(query).all())


def obtener_por_id(session: Session, id: int) -> Producto:
    producto = session.get(Producto, id)
    if not producto or not producto.activo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {id} no encontrado."
        )
    return producto


def obtener_por_id_con_categorias(session: Session, id: int) -> dict:
    producto = obtener_por_id(session, id)
    categorias_activas = [cat for cat in producto.categorias if cat.activo]
    return {
        "id": producto.id,
        "nombre": producto.nombre,
        "descripcion": producto.descripcion,
        "precio_base": producto.precio_base,
        "imagen_url": producto.imagen_url,
        "disponible": producto.disponible,
        "activo": producto.activo,
        "categorias": categorias_activas
    }


def actualizar_producto(session: Session, id: int, data: ProductoUpdate) -> Producto:
    producto = obtener_por_id(session, id)

    datos = data.model_dump(exclude_unset=True)

    if "nombre" in datos and datos["nombre"]:
        nuevo_nombre = datos["nombre"].strip()
        existente = session.exec(
            select(Producto).where(
                func.lower(Producto.nombre) == func.lower(nuevo_nombre),
                Producto.id != id,
                Producto.activo == True
            )
        ).first()

        if existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe otro producto registrado con el nombre '{nuevo_nombre}'."
            )
        datos["nombre"] = nuevo_nombre

    if "descripcion" in datos and datos["descripcion"] is not None:
        datos["descripcion"] = datos["descripcion"].strip()

    if "imagen_url" in datos and datos["imagen_url"] is not None:
        datos["imagen_url"] = datos["imagen_url"].strip()

    producto.sqlmodel_update(datos)
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


def eliminar_producto(session: Session, id: int) -> dict:
    producto = obtener_por_id(session, id)
    producto.activo = False
    session.add(producto)
    session.commit()
    return {"message": f"Producto con id {id} eliminado correctamente (soft delete)."}


def asociar_categoria(session: Session, producto_id: int, categoria_id: int) -> dict:
    producto = session.get(Producto, producto_id)
    if not producto or not producto.activo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {producto_id} no encontrado."
        )

    categoria = session.get(Categoria, categoria_id)
    if not categoria or not categoria.activo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con id {categoria_id} no encontrada."
        )

    enlace_existente = session.get(ProductoCategoria, (producto_id, categoria_id))
    if enlace_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"El producto '{producto.nombre}' ya se encuentra asociado a la categoría '{categoria.nombre}'."
        )

    nuevo_enlace = ProductoCategoria(producto_id=producto_id, categoria_id=categoria_id)
    session.add(nuevo_enlace)
    session.commit()

    return {
        "message": "Asociación registrada con éxito.",
        "producto_id": producto_id,
        "categoria_id": categoria_id,
        "producto_nombre": producto.nombre,
        "categoria_nombre": categoria.nombre
    }


def desasociar_categoria(session: Session, producto_id: int, categoria_id: int) -> dict:
    enlace = session.get(ProductoCategoria, (producto_id, categoria_id))
    if not enlace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró asociación entre el producto id {producto_id} y la categoría id {categoria_id}."
        )

    session.delete(enlace)
    session.commit()
    return {"message": "Asociación eliminada correctamente."}


def obtener_categorias_de_producto(session: Session, producto_id: int) -> List[Categoria]:
    producto = obtener_por_id(session, producto_id)
    return [cat for cat in producto.categorias if cat.activo]
