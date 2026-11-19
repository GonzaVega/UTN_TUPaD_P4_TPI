from typing import Optional
from app.modules.categorias.schemas import CategoriaRead
from app.modules.categorias.service import CategoriaNoEncontrada
from app.modules.productos.models import Producto
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from app.modules.productos.unit_of_work import ProductoUnitOfWork

class ProductoNoEncontrado(Exception):
    def __init__(self, prod_id: int):
        self.prod_id = prod_id
        super().__init__(f"Producto con id {prod_id} no encontrado o inactivo")

class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork):
        self.uow = uow

    def listar(
        self,
        skip: int = 0,
        limit: int = 20,
        search_query: Optional[str] = None,
        categoria_id: Optional[int] = None,
        disponible: Optional[bool] = None,
    ) -> ProductosPaginados:
        with self.uow as uow:
            total, prods = uow.productos.search(
                skip=skip,
                limit=limit,
                search_query=search_query,
                categoria_id=categoria_id,
                disponible=disponible,
            )
            items = []
            for p in prods:
                p_read = ProductoRead.model_validate(p)
                if p.categoria is not None:
                    p_read.categoria = CategoriaRead.model_validate(p.categoria)
                items.append(p_read)
            return ProductosPaginados(total=total, items=items)

    def obtener_por_id(self, prod_id: int) -> ProductoRead:
        with self.uow as uow:
            p = uow.productos.get_by_id(prod_id)
            if p is None or not p.activo:
                raise ProductoNoEncontrado(prod_id)
            p_read = ProductoRead.model_validate(p)
            if p.categoria is not None:
                p_read.categoria = CategoriaRead.model_validate(p.categoria)
            return p_read

    def crear(self, data: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            cat = uow.categorias.get_by_id(data.categoria_id)
            if cat is None or not cat.activo:
                raise CategoriaNoEncontrada(data.categoria_id)

            nuevo = Producto(
                nombre=data.nombre.strip(),
                descripcion=data.descripcion.strip() if data.descripcion else "",
                precio_base=data.precio_base,
                imagen_url=data.imagen_url.strip() if data.imagen_url else "",
                stock=data.stock,
                disponible=data.disponible,
                activo=True,
                categoria_id=data.categoria_id,
            )
            uow.productos.add(nuevo)
            p_read = ProductoRead.model_validate(nuevo)
            p_read.categoria = CategoriaRead.model_validate(cat)
            return p_read

    def actualizar(self, prod_id: int, data: ProductoUpdate) -> ProductoRead:
        with self.uow as uow:
            p = uow.productos.get_by_id(prod_id)
            if p is None or not p.activo:
                raise ProductoNoEncontrado(prod_id)

            if data.categoria_id is not None:
                nueva_cat = uow.categorias.get_by_id(data.categoria_id)
                if nueva_cat is None or not nueva_cat.activo:
                    raise CategoriaNoEncontrada(data.categoria_id)
                p.categoria_id = data.categoria_id

            if data.nombre is not None:
                p.nombre = data.nombre.strip()
            if data.descripcion is not None:
                p.descripcion = data.descripcion.strip()
            if data.precio_base is not None:
                p.precio_base = data.precio_base
            if data.imagen_url is not None:
                p.imagen_url = data.imagen_url.strip()
            if data.stock is not None:
                p.stock = data.stock
            if data.disponible is not None:
                p.disponible = data.disponible

            uow.session.flush()
            uow.session.refresh(p)
            p_read = ProductoRead.model_validate(p)
            if p.categoria is not None:
                p_read.categoria = CategoriaRead.model_validate(p.categoria)
            return p_read

    def actualizar_stock(self, prod_id: int, data: ProductoStockUpdate) -> ProductoRead:
        with self.uow as uow:
            p = uow.productos.get_by_id(prod_id)
            if p is None or not p.activo:
                raise ProductoNoEncontrado(prod_id)

            p.stock = data.stock
            p.disponible = data.disponible
            uow.session.flush()
            uow.session.refresh(p)
            p_read = ProductoRead.model_validate(p)
            if p.categoria is not None:
                p_read.categoria = CategoriaRead.model_validate(p.categoria)
            return p_read

    def eliminar_logico(self, prod_id: int) -> None:
        with self.uow as uow:
            p = uow.productos.get_by_id(prod_id)
            if p is None or not p.activo:
                raise ProductoNoEncontrado(prod_id)
            p.activo = False

