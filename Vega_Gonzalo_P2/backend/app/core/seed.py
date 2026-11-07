import logging
from typing import List, Dict, Any
from sqlmodel import Session, select, func
from app.modules.unidades_medida.model import UnidadMedida, TipoUnidad
from app.modules.categorias.model import Categoria
from app.modules.productos.model import Producto, ProductoCategoria

logger = logging.getLogger("app.seed")

# 1. Catálogo obligatorio de Unidades de Medida (Requerimiento 1)
UNIDADES_INICIALES: List[Dict[str, Any]] = [
    {"nombre": "kilogramo", "simbolo": "kg", "tipo": TipoUnidad.peso},
    {"nombre": "gramo", "simbolo": "g", "tipo": TipoUnidad.peso},
    {"nombre": "litro", "simbolo": "L", "tipo": TipoUnidad.volumen},
    {"nombre": "mililitro", "simbolo": "mL", "tipo": TipoUnidad.volumen},
    {"nombre": "pieza", "simbolo": "u", "tipo": TipoUnidad.contable},
    {"nombre": "docena", "simbolo": "doc", "tipo": TipoUnidad.contable},
]

# 2. Categorías gastronómicas de demostración
CATEGORIAS_INICIALES: List[Dict[str, str]] = [
    {
        "nombre": "Pastas",
        "descripcion": "Pastas artesanales frescas elaboradas en el día con harina de sémola e ingredientes seleccionados."
    },
    {
        "nombre": "Pizzas & Empanadas",
        "descripcion": "Pizzas a la piedra con fermentación lenta y empanadas tradicionales al horno de barro."
    },
    {
        "nombre": "Carnes & Minutas",
        "descripcion": "Cortes vacunos seleccionados, milanesas caseras y guarniciones clásicas."
    },
    {
        "nombre": "Bebidas & Postres",
        "descripcion": "Bebidas frescas, cervezas tiradas, jugos naturales y postres caseros tradicionales."
    }
]

# 3. Catálogo demostrativo de productos (variando unidades de peso, volumen y contables con existencias)
PRODUCTOS_INICIALES: List[Dict[str, Any]] = [
    {
        "nombre": "Ravioles Caseros de Ricota y Nuez",
        "descripcion": "Caja de ravioles artesanales rellenos de ricota cremosa y nueces picadas.",
        "precio_base": 4200.00,
        "unidad_simbolo": "u",
        "stock_cantidad": 18,
        "disponible": True,
        "categoria_nombre": "Pastas",
        "es_principal": True
    },
    {
        "nombre": "Sorrentinos de Jamón y Queso",
        "descripcion": "Plancha de sorrentinos grandes con abundante jamón cocido natural y mozzarella.",
        "precio_base": 4800.00,
        "unidad_simbolo": "u",
        "stock_cantidad": 14,
        "disponible": True,
        "categoria_nombre": "Pastas",
        "es_principal": True
    },
    {
        "nombre": "Ñoquis de Papa Tradicionales",
        "descripcion": "Ñoquis artesanales de papa fresca listos para hervir, pesados por kilogramo.",
        "precio_base": 3600.50,
        "unidad_simbolo": "kg",
        "stock_cantidad": 12.5,
        "disponible": True,
        "categoria_nombre": "Pastas",
        "es_principal": True
    },
    {
        "nombre": "Pizza Mozzarella Clásica",
        "descripcion": "Masa madre crocante, salsa de tomate casera, abundante mozzarella, orégano y aceitunas.",
        "precio_base": 7800.00,
        "unidad_simbolo": "u",
        "stock_cantidad": 10,
        "disponible": True,
        "categoria_nombre": "Pizzas & Empanadas",
        "es_principal": True
    },
    {
        "nombre": "Pizza Fugazzeta Rellena",
        "descripcion": "Doble masa rellena de queso provolone y mozzarella, cubierta con cebollas doradas.",
        "precio_base": 9200.00,
        "unidad_simbolo": "u",
        "stock_cantidad": 6,
        "disponible": True,
        "categoria_nombre": "Pizzas & Empanadas",
        "es_principal": True
    },
    {
        "nombre": "Empanadas de Carne Suave (Docena)",
        "descripcion": "Docena de empanadas de carne cortada a cuchillo con cebolla de verdeo y huevo duro.",
        "precio_base": 12500.00,
        "unidad_simbolo": "doc",
        "stock_cantidad": 8,
        "disponible": True,
        "categoria_nombre": "Pizzas & Empanadas",
        "es_principal": True
    },
    {
        "nombre": "Milanesa de Ternera Gigante",
        "descripcion": "Milanesa de nalga tierna rebozada con pan rallado casero y provenzal fresco.",
        "precio_base": 8900.00,
        "unidad_simbolo": "kg",
        "stock_cantidad": 15.0,
        "disponible": True,
        "categoria_nombre": "Carnes & Minutas",
        "es_principal": True
    },
    {
        "nombre": "Suprema de Pollo al Limón",
        "descripcion": "Pechuga de pollo desgrasada por kilogramo con adobo suave de limón y hierbas.",
        "precio_base": 7500.25,
        "unidad_simbolo": "kg",
        "stock_cantidad": 9.75,
        "disponible": True,
        "categoria_nombre": "Carnes & Minutas",
        "es_principal": True
    },
    {
        "nombre": "Limonada Menta y Jengibre (1L)",
        "descripcion": "Botella de litro con jugo fresco de limón exprimido, hojas de menta fresca y jengibre.",
        "precio_base": 2400.00,
        "unidad_simbolo": "L",
        "stock_cantidad": 20.0,
        "disponible": True,
        "categoria_nombre": "Bebidas & Postres",
        "es_principal": True
    },
    {
        "nombre": "Tiramisú Artesanal de Café",
        "descripcion": "Porción individual de postre tradicional con vainillas al café expreso y crema mascarpone.",
        "precio_base": 3200.00,
        "unidad_simbolo": "u",
        "stock_cantidad": 0,
        "disponible": True,  # Disponible para la venta pero temporalmente sin existencias (hay_stock = false)
        "categoria_nombre": "Bebidas & Postres",
        "es_principal": True
    }
]


def seed_database(session: Session) -> bool:
    total_unidades = session.exec(select(func.count(UnidadMedida.id))).one()

    # 1. Asegurar catálogo de unidades de medida (Requerimiento 1)
    if total_unidades == 0:
        logger.info("Poblando catálogo obligatorio de unidades de medida...")
        for u in UNIDADES_INICIALES:
            nueva_unidad = UnidadMedida(
                nombre=u["nombre"],
                simbolo=u["simbolo"],
                tipo=u["tipo"]
            )
            session.add(nueva_unidad)
        session.commit()
        logger.info("Unidades de medida inicializadas con éxito.")

    # 2. Verificar si ya existen productos cargados
    total_productos = session.exec(select(func.count(Producto.id))).one()
    if total_productos > 0:
        logger.info("La base de datos ya contiene %d productos. Omitiendo seed demostrativo.", total_productos)
        return False

    logger.info("Base de datos de productos vacía. Insertando categorías y productos iniciales de prueba...")

    # Mapear unidades por símbolo
    unidades_map: Dict[str, UnidadMedida] = {
        u.simbolo: u for u in session.exec(select(UnidadMedida)).all()
    }

    # Crear categorías
    categorias_map: Dict[str, Categoria] = {}
    for cat_data in CATEGORIAS_INICIALES:
        cat_existente = session.exec(
            select(Categoria).where(Categoria.nombre == cat_data["nombre"])
        ).first()

        if not cat_existente:
            nueva_cat = Categoria(
                nombre=cat_data["nombre"],
                descripcion=cat_data["descripcion"],
                activo=True
            )
            session.add(nueva_cat)
            categorias_map[cat_data["nombre"]] = nueva_cat
        else:
            categorias_map[cat_data["nombre"]] = cat_existente

    session.commit()

    for c in categorias_map.values():
        session.refresh(c)

    # Crear productos y vincularlos a su categoría
    for prod_data in PRODUCTOS_INICIALES:
        unidad_obj = unidades_map.get(prod_data["unidad_simbolo"])
        if not unidad_obj or unidad_obj.id is None:
            continue

        nuevo_prod = Producto(
            nombre=prod_data["nombre"],
            descripcion=prod_data["descripcion"],
            precio_base=prod_data["precio_base"],
            stock_cantidad=prod_data["stock_cantidad"],
            unidad_venta_id=unidad_obj.id,
            disponible=prod_data["disponible"],
            activo=True,
            anulado_at=None
        )
        session.add(nuevo_prod)
        session.commit()
        session.refresh(nuevo_prod)

        cat_obj = categorias_map.get(prod_data["categoria_nombre"])
        if cat_obj and cat_obj.id is not None and nuevo_prod.id is not None:
            enlace = ProductoCategoria(
                producto_id=nuevo_prod.id,
                categoria_id=cat_obj.id,
                es_principal=prod_data.get("es_principal", True)
            )
            session.add(enlace)

    session.commit()
    logger.info("Seed demostrativo completado con éxito: 4 categorías y 10 productos cargados.")
    return True
