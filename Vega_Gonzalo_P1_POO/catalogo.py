from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class UnidadMedida:
    """Representa una unidad de medida inmutable para los productos del catálogo."""
    nombre: str
    simbolo: str
    tipo: str


class Categoria:
    """Representa una categoría a la que pueden pertenecer los productos."""

    def __init__(self, nombre: str, descripcion: str = "") -> None:
        if not nombre or not nombre.strip():
            raise ErrorDominio("El nombre de la categoría no puede estar vacío.")
        self._nombre: str = nombre
        self._descripcion: str = descripcion

    @property
    def nombre(self) -> str:
        return self._nombre

    @property
    def descripcion(self) -> str:
        return self._descripcion


class ProductoCategoria:
    """Vínculo entre un producto y una categoría con indicación de si es principal."""

    def __init__(self, categoria: Categoria, es_principal: bool = False) -> None:
        if not isinstance(categoria, Categoria):
            raise ErrorDominio("La categoría debe ser una instancia válida de Categoria.")
        self._categoria: Categoria = categoria
        self._es_principal: bool = es_principal

    @property
    def categoria(self) -> Categoria:
        return self._categoria

    @property
    def es_principal(self) -> bool:
        return self._es_principal

    def _marcar_principal(self, valor: bool) -> None:
        """Método protegido de dominio para que el Producto dueño gestione la principalidad."""
        self._es_principal = valor


class Exportable(Protocol):
    """Contrato estructural para elementos que pueden ser exportados a texto."""

    def exportar(self) -> str:
        ...


class Producto(ABC):
    """Clase base abstracta para todos los productos del catálogo."""

    def __init__(
        self,
        nombre: str,
        precio_base: float,
        stock_cantidad: float,
        categoria_principal: Categoria,
        unidad_venta: UnidadMedida | None = None,
    ) -> None:
        if not nombre or not nombre.strip():
            raise ErrorDominio("El nombre del producto no puede estar vacío.")
        if precio_base < 0:
            raise ErrorDominio("El precio base no puede ser negativo.")
        if stock_cantidad < 0:
            raise ErrorDominio("El stock no puede ser negativo.")
        if not isinstance(categoria_principal, Categoria):
            raise ErrorDominio("Debe indicarse una categoría principal válida.")

        self._nombre: str = nombre
        self._precio_base: float = float(precio_base)
        self._stock_cantidad: float = float(stock_cantidad)
        self._habilitado: bool = True
        self._unidad_venta: UnidadMedida | None = unidad_venta
        self._orden_vidriera: int | None = None

        # Composición: el propio producto fabrica el vínculo inicial como principal
        self._clasificaciones: list[ProductoCategoria] = []
        primer_vinculo = ProductoCategoria(categoria_principal, es_principal=True)
        self._clasificaciones.append(primer_vinculo)

    @property
    def nombre(self) -> str:
        return self._nombre

    @property
    def precio_base(self) -> float:
        return self._precio_base

    @property
    def stock_cantidad(self) -> float:
        return self._stock_cantidad

    @property
    def unidad_venta(self) -> UnidadMedida | None:
        return self._unidad_venta

    @property
    def disponible(self) -> bool:
        return self._habilitado and self.stock_cantidad > 0

    @property
    def precio_publicado(self) -> str:
        if self._unidad_venta is not None:
            return f"$ {self.precio_base:.2f} / {self._unidad_venta.simbolo}"
        return f"$ {self.precio_base:.2f}"

    @property
    def orden_vidriera(self) -> int | None:
        return self._orden_vidriera

    def habilitar(self) -> None:
        self._habilitado = True

    def deshabilitar(self) -> None:
        self._habilitado = False

    def clasificar_en(self, categoria: Categoria, es_principal: bool = False) -> None:
        if not isinstance(categoria, Categoria):
            raise ErrorDominio("La categoría debe ser una instancia válida de Categoria.")

        for vinculo in self._clasificaciones:
            if vinculo.categoria == categoria:
                raise ErrorDominio("El producto ya está clasificado en esta categoría.")

        if es_principal:
            for vinculo in self._clasificaciones:
                if vinculo.es_principal:
                    vinculo._marcar_principal(False)

        nuevo_vinculo = ProductoCategoria(categoria, es_principal=es_principal)
        self._clasificaciones.append(nuevo_vinculo)

    def categorias(self) -> tuple[ProductoCategoria, ...]:
        return tuple(self._clasificaciones)

    def categoria_principal(self) -> Categoria:
        for vinculo in self._clasificaciones:
            if vinculo.es_principal:
                return vinculo.categoria
        raise ErrorDominio("El producto no posee una categoría principal configurada.")

    def destacar(self, orden: int) -> None:
        if not isinstance(orden, int) or orden < 1:
            raise ErrorDominio("El orden de vidriera debe ser un número entero mayor o igual a 1.")
        self._orden_vidriera = orden

    def quitar_destacado(self) -> None:
        self._orden_vidriera = None

    def exportar(self) -> str:
        return f"PRODUCTO|{self._nombre}|{self.precio_publicado}"

    @abstractmethod
    def precio_final(self, cantidad: float) -> float:
        pass


class ProductoSimple(Producto):
    """Producto vendido por unidad o pieza entera."""

    def precio_final(self, cantidad: float) -> float:
        if not isinstance(cantidad, (int, float)):
            raise ErrorDominio("La cantidad debe ser numérica.")
        if cantidad < 1:
            raise ErrorDominio("La cantidad debe ser mayor o igual a 1.")
        if int(cantidad) != cantidad:
            raise ErrorDominio("La cantidad para un producto simple debe ser de valor entero.")

        return float(self.precio_base * cantidad)


class ProductoPorPeso(Producto):
    """Producto vendido por fracción de peso (kg, g, etc.)."""

    def precio_final(self, cantidad: float) -> float:
        if not isinstance(cantidad, (int, float)):
            raise ErrorDominio("La cantidad debe ser numérica.")
        if cantidad <= 0:
            raise ErrorDominio("La cantidad debe ser mayor a 0.")

        return round(self.precio_base * cantidad, 2)


class ProductoCombo(Producto):
    """Combo promocional que agrupa dos o más productos existentes aplicando un descuento."""

    def __init__(
        self,
        nombre: str,
        categoria_principal: Categoria,
        componentes: list[Producto],
        descuento: float,
        unidad_venta: UnidadMedida | None = None,
    ) -> None:
        if not isinstance(componentes, (list, tuple)):
            raise ErrorDominio("Los componentes deben ser una lista o tupla de productos.")
        if len(componentes) < 2:
            raise ErrorDominio("Un combo debe tener al menos 2 componentes.")
        for comp in componentes:
            if not isinstance(comp, Producto):
                raise ErrorDominio("Todos los componentes de un combo deben ser productos válidos.")
        if not isinstance(descuento, (int, float)):
            raise ErrorDominio("El descuento debe ser un valor numérico.")
        if not (0 <= descuento < 1):
            raise ErrorDominio("El descuento debe estar en el intervalo [0, 1).")

        # Se inicializa el padre con 0.0 ya que precio_base y stock_cantidad son derivados (Decisión B2)
        super().__init__(
            nombre=nombre,
            precio_base=0.0,
            stock_cantidad=0.0,
            categoria_principal=categoria_principal,
            unidad_venta=unidad_venta,
        )
        self._componentes: list[Producto] = list(componentes)
        self._descuento: float = float(descuento)

    @property
    def precio_base(self) -> float:
        """Suma de precio_final(1) de cada componente (precio sin descuento)."""
        total = 0.0
        for componente in self._componentes:
            total += componente.precio_final(1)
        return total

    @property
    def stock_cantidad(self) -> float:
        """El stock del combo está determinado por el componente con menor stock."""
        if not self._componentes:
            return 0.0
        minimo = self._componentes[0].stock_cantidad
        for componente in self._componentes[1:]:
            if componente.stock_cantidad < minimo:
                minimo = componente.stock_cantidad
        return minimo

    def componentes(self) -> tuple[Producto, ...]:
        """Retorna una copia inmutable (tupla) de los componentes agregados."""
        return tuple(self._componentes)

    def precio_final(self, cantidad: float) -> float:
        if not isinstance(cantidad, (int, float)):
            raise ErrorDominio("La cantidad debe ser numérica.")
        if cantidad < 1:
            raise ErrorDominio("La cantidad debe ser mayor o igual a 1.")
        if int(cantidad) != cantidad:
            raise ErrorDominio("La cantidad para un combo debe ser de valor entero.")

        # Fórmula: (suma de componente.precio_final(1)) * (1 - descuento) * cantidad
        total_sin_descuento = self.precio_base
        return (total_sin_descuento * (1.0 - self._descuento)) * cantidad


def exportar_catalogo(items: list[Exportable]) -> list[str]:
    """Exporta una lista polimórfica de objetos que cumplen el contrato Exportable."""
    resultado: list[str] = []
    for item in items:
        resultado.append(item.exportar())
    return resultado


# =====================================================================
# Excepciones de Dominio (al final del archivo)
# =====================================================================

class ErrorDominio(ValueError):
    """Excepción base para errores de validación y reglas de negocio del catálogo."""
    pass
