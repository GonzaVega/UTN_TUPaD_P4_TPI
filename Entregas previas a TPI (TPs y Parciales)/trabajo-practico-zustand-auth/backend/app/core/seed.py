import logging
import sys
from typing import Any, Dict, List
from sqlmodel import Session, SQLModel, func, select
from app.categoria.model import Categoria, ProductoCategoria
from app.core.database import engine
from app.core.security import get_password_hash
from app.ingrediente.model import Ingrediente
from app.modules.usuarios.models import Rol, Usuario, UsuarioRol
from app.producto.model import Producto

logger = logging.getLogger("app.seed")
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

ROLES_INICIALES = [
    {"nombre": "admin", "descripcion": "Administrador con permisos completos de lectura y escritura"},
    {"nombre": "user", "descripcion": "Usuario estándar con permisos de lectura y compras"},
]

CATEGORIAS_INICIALES: List[Dict[str, str]] = [
    {
        "nombre": "Pizzas",
        "descripcion": "Pizzas artesanales con masa madre, fermentación en frío e ingredientes frescos seleccionados.",
    },
    {
        "nombre": "Hamburguesas",
        "descripcion": "Hamburguesas gourmet con medallones de carne seleccionada, queso fundido y panes artesanales.",
    },
    {
        "nombre": "Bebidas",
        "descripcion": "Gaseosas, jugos naturales exprimidos, aguas saborizadas y cervezas artesanales.",
    },
]

PRODUCTOS_INICIALES: List[Dict[str, Any]] = [
    {
        "nombre": "Pizza Margherita",
        "descripcion": "Salsa de tomate casera, mozzarella fior di latte, albahaca fresca y aceite de oliva virgen extra.",
        "precio_base": 12.50,
        "imagen_url": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
        "disponible": True,
        "categoria_nombre": "Pizzas",
    },
    {
        "nombre": "Pizza Cuatro Quesos",
        "descripcion": "Mozzarella, gorgonzola, queso parmesano curado y provolone fundido con toque de orégano.",
        "precio_base": 14.50,
        "imagen_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591",
        "disponible": True,
        "categoria_nombre": "Pizzas",
    },
    {
        "nombre": "Pizza Pepperoni",
        "descripcion": "Salsa de tomate especiada, mozzarella abundante y finas rodajas de pepperoni crocante.",
        "precio_base": 13.80,
        "imagen_url": "https://images.unsplash.com/photo-1628840042765-356cda07504e",
        "disponible": True,
        "categoria_nombre": "Pizzas",
    },
    {
        "nombre": "Pizza Fugazzeta",
        "descripcion": "Masa tradicional rellena de mozzarella con cubierta dorada de cebollas caramelizadas al orégano.",
        "precio_base": 13.00,
        "imagen_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
        "disponible": True,
        "categoria_nombre": "Pizzas",
    },
    {
        "nombre": "Hamburguesa Clásica",
        "descripcion": "Medallón de carne vacuna 180g, queso cheddar, lechuga crocante, tomate fresco y aderezo de la casa.",
        "precio_base": 11.00,
        "imagen_url": "https://images.unsplash.com/photo-1550547660-d9450f859349",
        "disponible": True,
        "categoria_nombre": "Hamburguesas",
    },
    {
        "nombre": "Hamburguesa Doble Cheddar & Bacon",
        "descripcion": "Doble medallón 120g, cuádruple cheddar, abundante panceta crocante y salsa barbacoa ahumada.",
        "precio_base": 15.50,
        "imagen_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        "disponible": True,
        "categoria_nombre": "Hamburguesas",
    },
    {
        "nombre": "Hamburguesa Crispy Chicken",
        "descripcion": "Pechuga de pollo rebozada super crujiente, pepinillos encurtidos, lechuga y mayonesa suave de hierbas.",
        "precio_base": 12.00,
        "imagen_url": "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b",
        "disponible": True,
        "categoria_nombre": "Hamburguesas",
    },
    {
        "nombre": "Hamburguesa Veggie Burger",
        "descripcion": "Medallón artesanal de lentejas y garbanzos con palta en láminas, tomates secos y emulsión vegana.",
        "precio_base": 11.50,
        "imagen_url": "https://images.unsplash.com/photo-1520072959219-c595dc870360",
        "disponible": True,
        "categoria_nombre": "Hamburguesas",
    },
    {
        "nombre": "Limonada Menta y Jengibre",
        "descripcion": "Bebida fresca de limón exprimido 500ml con hojas de menta maceradas, jengibre y toque de miel.",
        "precio_base": 4.50,
        "imagen_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd",
        "disponible": True,
        "categoria_nombre": "Bebidas",
    },
    {
        "nombre": "Cerveza Artesanal IPA",
        "descripcion": "Cerveza rubia tirada 500ml con amargor lupulado intenso y aromas cítricos balanceados.",
        "precio_base": 6.00,
        "imagen_url": "https://images.unsplash.com/photo-1535958636474-b021ee887b13",
        "disponible": True,
        "categoria_nombre": "Bebidas",
    },
]

INGREDIENTES_INICIALES: List[str] = [
    "Queso Mozzarella",
    "Salsa de Tomate",
    "Albahaca Fresca",
    "Pepperoni",
    "Medallón Vacuno 180g",
    "Panceta Crocante",
    "Queso Cheddar",
    "Cebolla Caramelizada",
    "Hojas de Menta",
    "Lúpulo Cítrico",
]


def seed_database(session: Session) -> bool:
    SQLModel.metadata.create_all(engine)
    total_roles = session.exec(select(func.count(Rol.id))).one()
    total_usuarios = session.exec(select(func.count(Usuario.id))).one()
    total_categorias = session.exec(select(func.count(Categoria.id))).one()
    total_productos = session.exec(select(func.count(Producto.id))).one()
    total_ingredientes = session.exec(select(func.count(Ingrediente.id))).one()

    if total_roles > 0 and total_usuarios > 0 and total_categorias > 0:
        return False

    roles_dict: Dict[str, Rol] = {}
    for r in ROLES_INICIALES:
        existente = session.exec(select(Rol).where(Rol.nombre == r["nombre"])).first()
        if not existente:
            nuevo_rol = Rol(nombre=r["nombre"], descripcion=r["descripcion"])
            session.add(nuevo_rol)
            roles_dict[r["nombre"]] = nuevo_rol
        else:
            roles_dict[r["nombre"]] = existente

    session.commit()
    for r in roles_dict.values():
        session.refresh(r)

    if total_usuarios == 0:
        admin_user = Usuario(
            nombre="Admin",
            apellido="FoodStore",
            email="admin@foodstore.com",
            celular="1122334455",
            password_hash=get_password_hash("admin1234"),
        )
        session.add(admin_user)

        normal_user = Usuario(
            nombre="Cliente",
            apellido="Ejemplo",
            email="user@foodstore.com",
            celular="1199887766",
            password_hash=get_password_hash("user1234"),
        )
        session.add(normal_user)
        session.commit()
        session.refresh(admin_user)
        session.refresh(normal_user)

        session.add(UsuarioRol(usuario_id=admin_user.id, rol_id=roles_dict["admin"].id))
        session.add(UsuarioRol(usuario_id=admin_user.id, rol_id=roles_dict["user"].id))
        session.add(UsuarioRol(usuario_id=normal_user.id, rol_id=roles_dict["user"].id))
        session.commit()

    if total_categorias == 0:
        categorias_por_nombre: Dict[str, Categoria] = {}
        for cat_data in CATEGORIAS_INICIALES:
            nueva_cat = Categoria(
                nombre=cat_data["nombre"],
                descripcion=cat_data["descripcion"],
            )
            session.add(nueva_cat)
            categorias_por_nombre[cat_data["nombre"]] = nueva_cat

        session.commit()

        for cat in categorias_por_nombre.values():
            session.refresh(cat)

        productos_creados: List[Producto] = []
        asociaciones: List[ProductoCategoria] = []

        for prod_data in PRODUCTOS_INICIALES:
            nuevo_prod = Producto(
                nombre=prod_data["nombre"],
                descripcion=prod_data["descripcion"],
                precio_base=prod_data["precio_base"],
                imagen_url=prod_data["imagen_url"],
                disponible=prod_data["disponible"],
            )
            session.add(nuevo_prod)
            productos_creados.append(nuevo_prod)

        session.commit()

        for i, prod in enumerate(productos_creados):
            session.refresh(prod)
            cat_nombre = PRODUCTOS_INICIALES[i]["categoria_nombre"]
            categoria_obj = categorias_por_nombre[cat_nombre]

            if prod.id is not None and categoria_obj.id is not None:
                asociaciones.append(
                    ProductoCategoria(
                        producto_id=prod.id,
                        categoria_id=categoria_obj.id,
                        es_principal=True,
                    )
                )

        for assoc in asociaciones:
            session.add(assoc)

        session.commit()

    if total_ingredientes == 0:
        for ing_nombre in INGREDIENTES_INICIALES:
            session.add(Ingrediente(nombre=ing_nombre, activo=True))

        session.commit()

    return True


def reset_and_seed(session: Session) -> None:
    for item in session.exec(select(ProductoCategoria)).all():
        session.delete(item)
    for item in session.exec(select(Producto)).all():
        session.delete(item)
    for item in session.exec(select(Categoria)).all():
        session.delete(item)
    for item in session.exec(select(Ingrediente)).all():
        session.delete(item)
    for item in session.exec(select(UsuarioRol)).all():
        session.delete(item)
    for item in session.exec(select(Usuario)).all():
        session.delete(item)
    for item in session.exec(select(Rol)).all():
        session.delete(item)
    session.commit()

    seed_database(session)


if __name__ == "__main__":
    with Session(engine) as session_cli:
        if "--reset" in sys.argv or "--force" in sys.argv:
            reset_and_seed(session_cli)
        else:
            seed_database(session_cli)
