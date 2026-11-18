from datetime import datetime, timezone
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlmodel import Session, select
from app.modules.unidades_medida.model import UnidadMedida, TipoUnidad, UnidadMedidaPublic
from app.modules.categorias.model import Categoria
from app.modules.productos.model import Producto, ProductoCategoria
from app.modules.productos.schema import (
    ProductoCreate,
    ProductoUpdate,
    ProductoPublic,
    CategoriaEnProductoPublic,
    ClasificarProductoRequest
)


def _validar_stock_contable(unidad: UnidadMedida, stock_cantidad: float) -> None:
    if unidad.tipo == TipoUnidad.contable:
        if stock_cantidad % 1 != 0:
            raise HTTPException(
                status_code=422,
                detail=f"La unidad de venta '{unidad.nombre}' es de tipo contable, por lo que el stock debe ser un número entero."
            )


def _construir_producto_public(session: Session, producto: Producto) -> ProductoPublic:
    hay_stock = producto.stock_cantidad > 0

    enlaces = session.exec(
        select(ProductoCategoria, Categoria)
        .where(ProductoCategoria.producto_id == producto.id)
        .join(Categoria, ProductoCategoria.categoria_id == Categoria.id)
        .order_by(Categoria.id)
    ).all()

    categorias_dto: List[CategoriaEnProductoPublic] = []
    for enlace, cat in enlaces:
        categorias_dto.append(
            CategoriaEnProductoPublic(
                id=cat.id,
                nombre=cat.nombre,
                descripcion=cat.descripcion,
                activo=cat.activo,
                es_principal=enlace.es_principal
            )
        )

    unidad_dto = UnidadMedidaPublic.model_validate(producto.unidad_venta)

    return ProductoPublic(
        id=producto.id,
        unidad_venta_id=producto.unidad_venta_id,
        nombre=producto.nombre,
        descripcion=producto.descripcion,
        precio_base=producto.precio_base,
        stock_cantidad=producto.stock_cantidad,
        disponible=producto.disponible,
        activo=producto.activo,
        anulado_at=producto.anulado_at,
        hay_stock=hay_stock,
        unidad_venta=unidad_dto,
        categorias=categorias_dto
    )


def crear_producto(session: Session, data: ProductoCreate) -> ProductoPublic:
    unidad = session.get(UnidadMedida, data.unidad_venta_id)
    if not unidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unidad de medida con id {data.unidad_venta_id} no encontrada."
        )

    _validar_stock_contable(unidad, data.stock_cantidad)

    nombre_limpio = data.nombre.strip()

    existente = session.exec(
        select(Producto).where(
            func.lower(Producto.nombre) == func.lower(nombre_limpio),
            Producto.activo == True
        )
    ).first()

    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un producto activo con el nombre '{nombre_limpio}'."
        )

    nuevo_producto = Producto(
        nombre=nombre_limpio,
        descripcion=data.descripcion.strip() if data.descripcion else None,
        precio_base=data.precio_base,
        stock_cantidad=data.stock_cantidad,
        unidad_venta_id=data.unidad_venta_id,
        disponible=data.disponible,
        activo=True,
        anulado_at=None
    )

    session.add(nuevo_producto)
    session.commit()
    session.refresh(nuevo_producto)

    return _construir_producto_public(session, nuevo_producto)


def listar_productos(
    session: Session,
    skip: int = 0,
    limit: int = 10,
    activo: Optional[bool] = None,
    disponible: Optional[bool] = None,
    categoria_id: Optional[int] = None,
    search: Optional[str] = None
) -> List[ProductoPublic]:
    query = select(Producto)

    if categoria_id is not None:
        query = query.join(ProductoCategoria, Producto.id == ProductoCategoria.producto_id).where(
            ProductoCategoria.categoria_id == categoria_id
        ).distinct()

    if activo is None or activo is True:
        query = query.where(Producto.activo == True)
    else:
        query = query.where(Producto.activo == False)
    if disponible is not None:
        query = query.where(Producto.disponible == disponible)

    if search:
        query = query.where(Producto.nombre.ilike(f"%{search.strip()}%"))

    query = query.order_by(Producto.id).offset(skip).limit(limit)
    productos = list(session.exec(query).all())

    return [_construir_producto_public(session, p) for p in productos]


def obtener_producto_por_id(session: Session, id: int) -> ProductoPublic:
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {id} no encontrado."
        )
    return _construir_producto_public(session, producto)


def actualizar_producto(session: Session, id: int, data: ProductoUpdate) -> ProductoPublic:
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {id} no encontrado."
        )

    if not producto.activo:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"El producto con id {id} se encuentra anulado y no puede modificarse."
        )

    unidad = session.get(UnidadMedida, data.unidad_venta_id)
    if not unidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unidad de medida con id {data.unidad_venta_id} no encontrada."
        )

    _validar_stock_contable(unidad, data.stock_cantidad)

    nombre_limpio = data.nombre.strip()

    existente = session.exec(
        select(Producto).where(
            func.lower(Producto.nombre) == func.lower(nombre_limpio),
            Producto.id != id,
            Producto.activo == True
        )
    ).first()

    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe otro producto activo con el nombre '{nombre_limpio}'."
        )

    producto.nombre = nombre_limpio
    producto.descripcion = data.descripcion.strip() if data.descripcion else None
    producto.precio_base = data.precio_base
    producto.unidad_venta_id = data.unidad_venta_id
    producto.stock_cantidad = data.stock_cantidad
    producto.disponible = data.disponible

    session.add(producto)
    session.commit()
    session.refresh(producto)

    return _construir_producto_public(session, producto)


def anular_producto(session: Session, id: int) -> None:
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {id} no encontrado."
        )

    if not producto.activo:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"El producto con id {id} ya se encuentra anulado."
        )

    producto.activo = False
    producto.anulado_at = datetime.now(timezone.utc)

    session.add(producto)
    session.commit()


def clasificar_producto(
    session: Session,
    producto_id: int,
    data: ClasificarProductoRequest
) -> CategoriaEnProductoPublic:
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {producto_id} no encontrado."
        )

    categoria = session.get(Categoria, data.categoria_id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con id {data.categoria_id} no encontrada."
        )

    if not producto.activo:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"El producto con id {producto_id} está anulado y no puede clasificarse."
        )

    if not categoria.activo:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"La categoría con id {data.categoria_id} está anulada y no puede recibir productos."
        )

    enlace_existente = session.get(ProductoCategoria, (producto_id, data.categoria_id))
    if enlace_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"El producto con id {producto_id} ya se encuentra clasificado en la categoría id {data.categoria_id}."
        )

    if data.es_principal:
        enlaces_previos = session.exec(
            select(ProductoCategoria).where(
                ProductoCategoria.producto_id == producto_id,
                ProductoCategoria.es_principal == True
            )
        ).all()
        for ep in enlaces_previos:
            ep.es_principal = False
            session.add(ep)

    nuevo_enlace = ProductoCategoria(
        producto_id=producto_id,
        categoria_id=data.categoria_id,
        es_principal=data.es_principal
    )
    session.add(nuevo_enlace)
    session.commit()

    return CategoriaEnProductoPublic(
        id=categoria.id,
        nombre=categoria.nombre,
        descripcion=categoria.descripcion,
        activo=categoria.activo,
        es_principal=data.es_principal
    )


def listar_categorias_de_producto(session: Session, producto_id: int) -> List[CategoriaEnProductoPublic]:
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {producto_id} no encontrado."
        )

    enlaces = session.exec(
        select(ProductoCategoria, Categoria)
        .where(ProductoCategoria.producto_id == producto_id)
        .join(Categoria, ProductoCategoria.categoria_id == Categoria.id)
        .order_by(Categoria.id)
    ).all()

    return [
        CategoriaEnProductoPublic(
            id=cat.id,
            nombre=cat.nombre,
            descripcion=cat.descripcion,
            activo=cat.activo,
            es_principal=enlace.es_principal
        )
        for enlace, cat in enlaces
    ]
