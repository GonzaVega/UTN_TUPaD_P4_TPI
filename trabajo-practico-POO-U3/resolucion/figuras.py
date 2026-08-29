"""figuras.py — Módulo central del dominio geométrico (Partes 1 a 4).

Implementa:
  - Etiqueta: value object inmutable con @dataclass(frozen=True).
  - Lado: entidad con validación de longitud, método escalar y asociación a Etiqueta.
  - Exportable: contrato estructural (typing.Protocol) para exportación a texto.
  - Figura: clase base abstracta (ABC) con método abstracto area().
  - Poligono: clase base abstracta (ABC) que cumple estructuralmente Exportable,
    con método abstracto lados_esperados() (falla temprana), composición a Lado,
    copia defensiva en lados() y etiquetar_lado() para asignación segura de etiquetas.
  - Subclases de Poligono: Triangulo (3), Cuadrado (4), Pentagono (5) y Hexagono (6).
    Cada una define su propio @classmethod regular(medida_lado) para construcción uniforme.
  - Taller: agregación hacia Poligono con copia defensiva en inventario().
  - exportar_todo: función polimórfica que opera sobre cualquier Exportable (Poligono o PlanoCAD).
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
import math
from typing import Protocol, runtime_checkable

# Se importa la librería externa del tercero sin modificarla
from libreria_externa import PlanoCAD


# ----------------------------------------------------------------------
# Parte 4: Contrato Estructural (Protocol)
# ----------------------------------------------------------------------

@runtime_checkable
class Exportable(Protocol):
    """Contrato estructural para objetos que pueden exportarse a texto.
    
    Cualquier clase que implemente exportar() -> str lo satisface automáticamente
    (duck typing), sin necesidad de herencia explícita.
    """

    def exportar(self) -> str:
        ...


def exportar_todo(items: list[Exportable]) -> list[str]:
    """Exporta una colección mixta de objetos que cumplen con el contrato Exportable.
    
    Funciona en runtime tanto con clases de nuestro dominio (Poligono)
    como con clases de terceros (PlanoCAD) mediante tipado estructural.
    """
    return [item.exportar() for item in items]


# ----------------------------------------------------------------------
# Parte 2: Clases de Datos y Componentes
# ----------------------------------------------------------------------

@dataclass(frozen=True)
class Etiqueta:
    """Identifica a un Lado con un texto descriptivo.
    
    Implementada como value object inmutable (@dataclass(frozen=True)).
    """
    texto: str


class Lado:
    """Representa un lado con longitud positiva y asociación opcional a Etiqueta (0..1)."""

    def __init__(self, longitud: float, etiqueta: Etiqueta | None = None) -> None:
        self.longitud = longitud  # Valida en setter
        self.etiqueta = etiqueta  # Asociación 0..1

    @property
    def longitud(self) -> float:
        return self._longitud

    @longitud.setter
    def longitud(self, valor: float) -> None:
        if valor <= 0:
            raise ValueError("La longitud del lado debe ser mayor que cero")
        self._longitud = float(valor)

    def escalar(self, factor: float) -> None:
        """Escala la longitud por un factor positivo."""
        if factor <= 0:
            raise ValueError("El factor de escala debe ser mayor que cero")
        self.longitud = self._longitud * factor

    def __repr__(self) -> str:
        etq_str = f", etiqueta='{self.etiqueta.texto}'" if self.etiqueta else ""
        return f"Lado(longitud={self._longitud}{etq_str})"


# ----------------------------------------------------------------------
# Parte 3: Jerarquía Abstracta de Figuras y Polígonos
# ----------------------------------------------------------------------

class Figura(ABC):
    """Clase base abstracta para todas las figuras geométricas."""

    def __init__(self, nombre: str, color: str) -> None:
        self.nombre = nombre
        self.color = color
        self._construida = True

    @abstractmethod
    def area(self) -> float:
        """Calcula el área de la figura geométrica."""
        pass


class Poligono(Figura, ABC):
    """Clase base abstracta para polígonos.
    
    - Herencia de Figura(ABC) y definición de lados_esperados() como abstractmethod.
    - Composición hacia Lado (1 a 3..*).
    - Cumple estructuralmente el protocolo Exportable con exportar().
    - Rediseño de regularidad: @property es_regular y @classmethod regular(...).
    """

    def __init__(
        self,
        nombre: str,
        color: str,
        lados: list[Lado] | tuple[Lado, ...] | None = None,
        observaciones: list[str] | None = None,
    ) -> None:
        super().__init__(nombre, color)
        self._lados: list[Lado] = list(lados) if lados is not None else []
        self._observaciones: list[str] = list(observaciones) if observaciones is not None else []

        # Validación estructural contra lados_esperados si se proveyeron lados
        esperados = self.lados_esperados()
        if self._lados and esperados > 0 and len(self._lados) != esperados:
            raise ValueError(
                f"{self.nombre} requiere exactamente {esperados} lados, pero recibió {len(self._lados)}"
            )

    @abstractmethod
    def lados_esperados(self) -> int:
        """Cantidad exacta de lados requerida para la figura concreta."""
        pass

    @property
    def estructura_valida(self) -> bool:
        """Indica si la figura tiene exactamente los lados esperados."""
        return len(self._lados) == self.lados_esperados()

    @property
    def es_regular(self) -> bool:
        """Propiedad derivada: verifica si todos sus lados tienen idéntica longitud."""
        if not self._lados or len(self._lados) < 3:
            return False
        primera = self._lados[0].longitud
        return all(math.isclose(l.longitud, primera, rel_tol=1e-5) for l in self._lados)

    def lados(self) -> tuple[Lado, ...]:
        """Copia defensiva: retorna los lados como tupla inmutable."""
        return tuple(self._lados)

    def etiquetar_lado(self, indice: int, etiqueta: "Etiqueta") -> None:
        """Asocia una etiqueta al lado indicado por su índice (acceso directo a la lista interna).
        
        No se puede hacer a través de lados() porque esa devuelve una copia defensiva.
        Se necesita un método propio de la clase para modificar el estado interno de forma controlada.
        """
        if not 0 <= indice < len(self._lados):
            raise IndexError(f"Índice {indice} fuera de rango para {len(self._lados)} lados")
        self._lados[indice].etiqueta = etiqueta

    def perimetro(self) -> float:
        """Calcula el perímetro sumando las longitudes de los lados."""
        return sum(l.longitud for l in self._lados)

    def exportar(self) -> str:
        """Cumple el contrato de Exportable retornando una representación legible."""
        reg_str = "regular" if self.es_regular else "irregular"
        return f"{self.nombre}[{self.color}, {len(self._lados)} lados, {reg_str}, perimetro={self.perimetro():.1f}]"

    def agregar_observacion(self, obs: str) -> None:
        self._observaciones.append(obs)

    @property
    def observaciones(self) -> tuple[str, ...]:
        return tuple(self._observaciones)


# ----------------------------------------------------------------------
# Subclases concretas por dominio
# ----------------------------------------------------------------------

class Triangulo(Poligono):
    """Subclase Triángulo (3 lados)."""

    def __init__(
        self,
        nombre: str = "Triángulo",
        color: str = "negro",
        lados: list[Lado] | tuple[Lado, ...] | None = None,
    ) -> None:
        super().__init__(nombre, color, lados)

    def lados_esperados(self) -> int:
        return 3

    @classmethod
    def regular(cls, medida_lado: float, color: str = "negro") -> "Triangulo":
        """Crea un triángulo equilátero: los 3 lados miden lo mismo."""
        lados = [Lado(medida_lado), Lado(medida_lado), Lado(medida_lado)]
        return cls("Triángulo", color, lados)

    def area(self) -> float:
        if len(self._lados) == 3:
            a, b, c = self._lados[0].longitud, self._lados[1].longitud, self._lados[2].longitud
            s = (a + b + c) / 2.0
            rad = s * (s - a) * (s - b) * (s - c)
            return math.sqrt(max(0.0, rad))
        return 0.0


class Cuadrado(Poligono):
    """Subclase Cuadrado (4 lados)."""

    def __init__(
        self,
        nombre: str = "Cuadrado",
        color: str = "negro",
        lados: list[Lado] | tuple[Lado, ...] | None = None,
    ) -> None:
        super().__init__(nombre, color, lados)

    def lados_esperados(self) -> int:
        return 4

    @classmethod
    def regular(cls, medida_lado: float, color: str = "negro") -> "Cuadrado":
        """Crea un cuadrado: los 4 lados miden lo mismo."""
        lados = [Lado(medida_lado) for _ in range(4)]
        return cls("Cuadrado", color, lados)

    def area(self) -> float:
        if self._lados:
            return self._lados[0].longitud ** 2
        return 0.0


class Pentagono(Poligono):
    """Subclase Pentágono (5 lados)."""

    def __init__(
        self,
        nombre: str = "Pentágono",
        color: str = "negro",
        lados: list[Lado] | tuple[Lado, ...] | None = None,
    ) -> None:
        super().__init__(nombre, color, lados)

    def lados_esperados(self) -> int:
        return 5

    @classmethod
    def regular(cls, medida_lado: float, color: str = "negro") -> "Pentagono":
        """Crea un pentágono regular: los 5 lados miden lo mismo."""
        lados = [Lado(medida_lado) for _ in range(5)]
        return cls("Pentágono", color, lados)

    def area(self) -> float:
        if len(self._lados) == 5 and self.es_regular:
            s = self._lados[0].longitud
            return (1.0 / 4.0) * math.sqrt(5.0 * (5.0 + 2.0 * math.sqrt(5.0))) * (s ** 2)
        return 0.0


class Hexagono(Poligono):
    """Subclase Hexágono (6 lados)."""

    def __init__(
        self,
        nombre: str = "Hexágono",
        color: str = "negro",
        lados: list[Lado] | tuple[Lado, ...] | None = None,
    ) -> None:
        super().__init__(nombre, color, lados)

    def lados_esperados(self) -> int:
        return 6

    @classmethod
    def regular(cls, medida_lado: float, color: str = "negro") -> "Hexagono":
        """Crea un hexágono regular: los 6 lados miden lo mismo."""
        lados = [Lado(medida_lado) for _ in range(6)]
        return cls("Hexágono", color, lados)

    def area(self) -> float:
        if len(self._lados) == 6 and self.es_regular:
            s = self._lados[0].longitud
            return (3.0 * math.sqrt(3.0) / 2.0) * (s ** 2)
        return 0.0


# ----------------------------------------------------------------------
# Taller (Agregación)
# ----------------------------------------------------------------------

class Taller:
    """Restaura polígonos recibidos externamente.
    
    Relación con Poligono: Agregación 1 a 0..* (los recibe ya construidos, no los fabrica).
    Aplica copia defensiva en inventario().
    """

    def __init__(self, poligonos: list[Poligono] | None = None) -> None:
        self._poligonos: list[Poligono] = list(poligonos) if poligonos is not None else []

    def recibir(self, poligono: Poligono) -> None:
        """Recibe un polígono externo y lo incorpora al taller."""
        if not isinstance(poligono, Poligono):
            raise TypeError("Solo se pueden recibir instancias de Poligono")
        self._poligonos.append(poligono)

    def restaurar(self, poligono: Poligono) -> None:
        """Restaura un polígono perteneciente al taller."""
        if poligono not in self._poligonos:
            raise ValueError("El polígono no está registrado en el inventario de este taller")
        poligono.agregar_observacion("Restaurado en Taller")

    def inventario(self) -> tuple[Poligono, ...]:
        """Copia defensiva: retorna los polígonos en inventario como tupla inmutable."""
        return tuple(self._poligonos)
