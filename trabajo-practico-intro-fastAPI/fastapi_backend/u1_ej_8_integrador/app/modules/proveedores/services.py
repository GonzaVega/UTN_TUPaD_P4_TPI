from typing import List, Optional
from .schemas import ProveedorCreate, ProveedorRead

# Simulamos que la BD guarda objetos tipo ProveedorRead (con ID asignado)
db_proveedores: List[ProveedorRead] = []
id_counter = 1


# Crear proveedor
def crear(data: ProveedorCreate) -> ProveedorRead:
    global id_counter
    if data.codigo not in [p.codigo for p in db_proveedores]:
        nuevo = ProveedorRead(id=id_counter, **data.model_dump())
        db_proveedores.append(nuevo)
        id_counter += 1
        return nuevo
    else:
        return None

# Filtra los proveedores por estado 'activo', con el limite que se envie por parametro (pueden ser los activos, no activos o todos)
def obtener_todos(skip: int, limit: int, activo: Optional[bool] = None ) -> List[ProveedorRead]:
    if activo is not None:
        return [p for p in db_proveedores if p.activo == activo][skip : skip + limit]
    return db_proveedores[skip : skip + limit]


# Filtra un proveedor por ID
def obtener_por_id(id: int) -> Optional[ProveedorRead]:
    for p in db_proveedores:
        if p.id == id:
            return p
    return None


# Reemplazo total: Requiere todos los campos validables (ProveedorCreate)
def actualizar_total(id: int, data: ProveedorCreate) -> Optional[ProveedorRead]:
    for index, p in enumerate(db_proveedores):
        if p.id == id:
            proveedor_actualizado = ProveedorRead(id=id, **data.model_dump())
            db_proveedores[index] = proveedor_actualizado
            return proveedor_actualizado
    return None


# Borrado lógico: Solo altera el estado 'activo'
def desactivar(id: int) -> Optional[ProveedorRead]:
    for index, p in enumerate(db_proveedores):
        if p.id == id and p.activo == True:
            p_dict = p.model_dump()
            p_dict["activo"] = False
            proveedor_actualizado = ProveedorRead(**p_dict)
            db_proveedores[index] = proveedor_actualizado
            return proveedor_actualizado
        elif p.id == id and p.activo == False:
            return 'already_eliminated'
    return None
