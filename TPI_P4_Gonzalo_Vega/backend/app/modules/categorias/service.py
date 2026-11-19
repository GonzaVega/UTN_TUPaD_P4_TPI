from typing import List
from app.modules.categorias.models import Categoria
from app.modules.categorias.schemas import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork

class CategoriaNoEncontrada(Exception):
    def __init__(self, cat_id: int):
        self.cat_id = cat_id
        super().__init__(f"Categoría con id {cat_id} no encontrada o inactiva")

class NombreDuplicado(Exception):
    def __init__(self, detalle: str):
        self.detalle = detalle
        super().__init__(detalle)

class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork):
        self.uow = uow

    def listar_activas(self) -> List[CategoriaRead]:
        with self.uow as uow:
            categorias = uow.categorias.get_activas()
            return [CategoriaRead.model_validate(c) for c in categorias]

    def obtener_por_id(self, cat_id: int) -> CategoriaRead:
        with self.uow as uow:
            cat = uow.categorias.get_by_id(cat_id)
            if cat is None or not cat.activo:
                raise CategoriaNoEncontrada(cat_id)
            return CategoriaRead.model_validate(cat)

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        nombre_limpio = data.nombre.strip()
        with self.uow as uow:
            existente = uow.categorias.get_by_nombre(nombre_limpio)
            if existente is not None:
                raise NombreDuplicado(f"Ya existe una categoría con el nombre '{nombre_limpio}'")

            nueva = Categoria(
                nombre=nombre_limpio,
                descripcion=data.descripcion.strip() if data.descripcion else "",
                activo=True,
            )
            uow.categorias.add(nueva)
            return CategoriaRead.model_validate(nueva)

    def actualizar(self, cat_id: int, data: CategoriaUpdate) -> CategoriaRead:
        with self.uow as uow:
            cat = uow.categorias.get_by_id(cat_id)
            if cat is None or not cat.activo:
                raise CategoriaNoEncontrada(cat_id)

            if data.nombre is not None:
                nombre_limpio = data.nombre.strip()
                if nombre_limpio != cat.nombre:
                    existente = uow.categorias.get_by_nombre(nombre_limpio)
                    if existente is not None and existente.id != cat_id:
                        raise NombreDuplicado(f"Ya existe una categoría con el nombre '{nombre_limpio}'")
                    cat.nombre = nombre_limpio

            if data.descripcion is not None:
                cat.descripcion = data.descripcion.strip()

            return CategoriaRead.model_validate(cat)

    def eliminar_logico(self, cat_id: int) -> None:
        with self.uow as uow:
            cat = uow.categorias.get_by_id(cat_id)
            if cat is None or not cat.activo:
                raise CategoriaNoEncontrada(cat_id)
            cat.activo = False

