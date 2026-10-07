from typing import List
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlmodel import Session, select
from app.categoria.model import Categoria, ProductoCategoria
from app.producto.model import Producto
from app.producto.schema import ProductoCreate, ProductoUpdate


def crear_producto(session: Session, data: ProductoCreate) -> Producto:
    """Crea un nuevo producto validando que el nombre no esté duplicado."""
    nombre_normalizado = data.nombre.strip()
    existente = session.exec(
        select(Producto).where(func.lower(Producto.nombre) == func.lower(nombre_normalizado))
    ).first()

    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un producto registrado con el nombre '{nombre_normalizado}'."
        )

    nuevo_producto = Producto(
        nombre=nombre_normalizado,
        descripcion=data.descripcion.strip() if data.descripcion else None,
        precio_base=data.precio_base,
        imagen_url=data.imagen_url.strip() if data.imagen_url else None,
        disponible=data.disponible
    )

    session.add(nuevo_producto)
    session.commit()
    session.refresh(nuevo_producto)
    return nuevo_producto


def obtener_todos(session: Session) -> List[Producto]:
    """Retorna todos los productos ordenados por ID."""
    query = select(Producto).order_by(Producto.id)
    return list(session.exec(query).all())


def obtener_por_id(session: Session, id: int) -> Producto:
    """Retorna un producto por su ID único. Lanza 404 si no existe."""
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {id} no encontrado."
        )
    return producto


def actualizar_producto(session: Session, id: int, data: ProductoUpdate) -> Producto:
    """Actualiza datos de un producto verificando duplicados si cambia el nombre."""
    producto = obtener_por_id(session, id)

    datos = data.model_dump(exclude_unset=True)

    if "nombre" in datos and datos["nombre"]:
        nuevo_nombre = datos["nombre"].strip()
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
    """Elimina físicamente el producto y sus vínculos en la tabla intermedia."""
    producto = obtener_por_id(session, id)

    # Eliminar asociaciones en la tabla intermedia
    enlaces = session.exec(
        select(ProductoCategoria).where(ProductoCategoria.producto_id == id)
    ).all()
    for enlace in enlaces:
        session.delete(enlace)

    session.delete(producto)
    session.commit()
    return {"message": f"Producto con id {id} eliminado correctamente."}


# =========================================================
# LÓGICA DE RELACIÓN N:N (Producto - Categoria)
# =========================================================

def asociar_categoria(session: Session, producto_id: int, categoria_id: int) -> dict:
    """Asocia un producto con una categoría mediante la tabla intermedia.
    Valida secuencialmente existencia (404) y duplicados (409).
    """
    # 1. Validar existencia del producto
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {producto_id} no encontrado."
        )

    # 2. Validar existencia de la categoría
    categoria = session.get(Categoria, categoria_id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con id {categoria_id} no encontrada."
        )

    # 3. Validar si ya existe el vínculo en la tabla intermedia
    enlace_existente = session.get(ProductoCategoria, (producto_id, categoria_id))
    if enlace_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"El producto '{producto.nombre}' ya se encuentra asociado a la categoría '{categoria.nombre}'."
        )

    # 4. Insertar nuevo registro en la tabla intermedia
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
    """Elimina el vínculo entre un producto y una categoría en la tabla intermedia."""
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
    """Retorna la lista de categorías asociadas a un producto."""
    producto = obtener_por_id(session, producto_id)
    return producto.categorias
