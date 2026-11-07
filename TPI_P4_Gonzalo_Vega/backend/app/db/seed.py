"""Módulo para el poblado inicial (seed) idempotente de la base de datos Food Store en PostgreSQL."""

import logging
from sqlmodel import Session, select
from app.core.database import create_all_tables, engine
from app.core.security import get_password_hash
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger("app.db.seed")

CATEGORIAS_DATA = [
    {
        "nombre": "Pizzas",
        "descripcion": "Pizzas artesanales al horno de barro con masa madre fermentada e ingredientes selectos.",
    },
    {
        "nombre": "Hamburguesas",
        "descripcion": "Hamburguesas gourmet con medallones de carne seleccionada y pan brioche artesanal.",
    },
    {
        "nombre": "Bebidas",
        "descripcion": "Gaseosas, cervezas artesanales y jugos naturales frescos.",
    },
    {
        "nombre": "Postres",
        "descripcion": "Postres tradicionales y helados artesanales.",
    },
]

PRODUCTOS_DATA = [
    {
        "nombre": "Pizza Margherita",
        "descripcion": "Salsa de tomate casera, mozzarella fior di latte, albahaca fresca y aceite de oliva virgen.",
        "precio_base": 12.50,
        "stock": 25,
        "disponible": True,
        "categoria": "Pizzas",
        "imagen_url": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=80",
    },
    {
        "nombre": "Pizza Cuatro Quesos",
        "descripcion": "Mozzarella, provolone, queso azul y reggianito con un toque de finas hierbas.",
        "precio_base": 14.80,
        "stock": 20,
        "disponible": True,
        "categoria": "Pizzas",
        "imagen_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
    },
    {
        "nombre": "Pizza Fugazzeta Especial",
        "descripcion": "Doble capa de mozzarella rellena con cubierta de cebollas caramelizadas al orégano.",
        "precio_base": 13.90,
        "stock": 18,
        "disponible": True,
        "categoria": "Pizzas",
        "imagen_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80",
    },
    {
        "nombre": "Hamburguesa Clásica",
        "descripcion": "Medallón de carne vacuna 180g, queso cheddar inglés, lechuga crocante y tomate en pan brioche.",
        "precio_base": 10.50,
        "stock": 35,
        "disponible": True,
        "categoria": "Hamburguesas",
        "imagen_url": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80",
    },
    {
        "nombre": "Hamburguesa Doble Bacon & Cheddar",
        "descripcion": "Doble medallón 120g, cuádruple queso cheddar, abundante panceta crocante y salsa barbacoa.",
        "precio_base": 15.20,
        "stock": 30,
        "disponible": True,
        "categoria": "Hamburguesas",
        "imagen_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
    },
    {
        "nombre": "Hamburguesa Veggie Burger",
        "descripcion": "Medallón de garbanzos y quinoa con guacamole, tomates secos y emulsión vegana.",
        "precio_base": 11.80,
        "stock": 15,
        "disponible": True,
        "categoria": "Hamburguesas",
        "imagen_url": "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&auto=format&fit=crop&q=80",
    },
    {
        "nombre": "Cerveza Artesanal IPA 500ml",
        "descripcion": "Cerveza rubia con amargor balanceado y notas cítricas de lúpulo fresco.",
        "precio_base": 5.50,
        "stock": 50,
        "disponible": True,
        "categoria": "Bebidas",
        "imagen_url": "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500&auto=format&fit=crop&q=80",
    },
    {
        "nombre": "Limonada con Menta y Jengibre 500ml",
        "descripcion": "Limonada fresca recién exprimida, macerada con jengibre y hojas de menta orgánica.",
        "precio_base": 4.20,
        "stock": 40,
        "disponible": True,
        "categoria": "Bebidas",
        "imagen_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
    },
    {
        "nombre": "Tiramisú Tradicional",
        "descripcion": "Clásico postre italiano con vainillas al café expreso, crema de mascarpone y cacao amargo.",
        "precio_base": 6.50,
        "stock": 22,
        "disponible": True,
        "categoria": "Postres",
        "imagen_url": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=80",
    },
    {
        "nombre": "Cheesecake de Frutos Rojos",
        "descripcion": "Tarta cremosa de queso horneada con base crocante y coulis de frambuesas y moras.",
        "precio_base": 7.00,
        "stock": 18,
        "disponible": True,
        "categoria": "Postres",
        "imagen_url": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80",
    },
]


def seed_database() -> None:
    """Carga los registros iniciales si no existen (operación idempotente)."""
    create_all_tables()

    with Session(engine) as session:
        # 1. Usuario Administrador
        admin = session.exec(
            select(Usuario).where(Usuario.username == "admin")
        ).first()
        if admin is None:
            admin = Usuario(
                username="admin",
                full_name="Administrador General",
                email="admin@foodstore.com",
                hashed_password=get_password_hash("Admin1234!"),
                role="admin",
                disabled=False,
            )
            session.add(admin)
            session.commit()
            session.refresh(admin)
            logger.info("Usuario admin creado exitosamente (admin / Admin1234!)")
        else:
            logger.info("Usuario admin ya existe. Omitiendo creación.")

        # 2. Categorías
        categorias_map = {}
        for cat_info in CATEGORIAS_DATA:
            cat = session.exec(
                select(Categoria).where(Categoria.nombre == cat_info["nombre"])
            ).first()
            if cat is None:
                cat = Categoria(
                    nombre=cat_info["nombre"],
                    descripcion=cat_info["descripcion"],
                    activo=True,
                )
                session.add(cat)
                session.commit()
                session.refresh(cat)
                logger.info("Categoría creada: %s", cat.nombre)
            categorias_map[cat.nombre] = cat

        # 3. Productos
        for prod_info in PRODUCTOS_DATA:
            cat_obj = categorias_map.get(prod_info["categoria"])
            if cat_obj is None:
                continue

            prod = session.exec(
                select(Producto).where(Producto.nombre == prod_info["nombre"])
            ).first()
            if prod is None:
                prod = Producto(
                    categoria_id=cat_obj.id,
                    nombre=prod_info["nombre"],
                    descripcion=prod_info["descripcion"],
                    precio_base=prod_info["precio_base"],
                    imagen_url=prod_info["imagen_url"],
                    stock=prod_info["stock"],
                    disponible=prod_info["disponible"],
                    activo=True,
                )
                session.add(prod)
                session.commit()
                logger.info("Producto creado: %s", prod.nombre)

        logger.info("Proceso de seed finalizado con éxito.")


if __name__ == "__main__":
    seed_database()

