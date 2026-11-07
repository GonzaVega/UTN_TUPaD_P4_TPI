from sqlmodel import Session, SQLModel, create_engine
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
)


def session_factory() -> Session:
    """Crea y devuelve una nueva sesión de SQLModel."""
    return Session(engine)


def create_all_tables() -> None:
    """Importa todos los modelos de tabla y crea las tablas en PostgreSQL."""
    import app.modules.usuarios.models  # noqa: F401
    import app.modules.categorias.models  # noqa: F401
    import app.modules.productos.models  # noqa: F401
    import app.modules.pedidos.models  # noqa: F401

    SQLModel.metadata.create_all(engine)

