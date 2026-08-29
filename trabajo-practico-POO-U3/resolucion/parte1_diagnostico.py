"""parte1_diagnostico.py — El dominio Figura / Polígono / Lado CORREGIDO.

Este archivo representa la versión saneada del código de partida tras aplicar
las tres inversiones conceptuales de la cátedra y eliminar los 8 java-ismos
de diseño, junto con el ruido sintáctico.
"""

import math


class Figura:
    """Clase base para figuras geométricas.

    Corrección Java-ismo 1: Se eliminan los getters preventivos getNombre() y getColor()
    que no aportaban lógica. Se exponen los atributos directos self.nombre y self.color.
    """

    def __init__(self, nombre: str, color: str) -> None:
        self.nombre = nombre
        self.color = color
        self._construida = True  # Marca de que Figura.__init__ realmente corrió

    def area(self) -> float:
        return 0.0


class Lado:
    """Representa un lado con longitud positiva.

    Corrección Java-ismo 2: Sustitución de getLongitud() / setLongitud() estilo Java bean
    por @property y @longitud.setter. Se valida en el setter y se asigna desde el __init__.
    """

    def __init__(self, longitud: float) -> None:
        self.longitud = longitud  # Pasa por el setter para validar al construir

    @property
    def longitud(self) -> float:
        return self._longitud

    @longitud.setter
    def longitud(self, valor: float) -> None:
        if valor <= 0:
            raise ValueError("La longitud debe ser positiva")
        self._longitud = float(valor)


class Poligono(Figura):
    """Polígono compuesto por una colección de lados.

    Correcciones aplicadas:
      - Java-ismo 3: Eliminación del atributo mutable de clase 'catalogo = []' (static accidental).
      - Java-ismo 4: Parámetros por defecto usan None en lugar de listas mutables ([]).
      - Java-ismo 5: Invocación explícita a super().__init__(nombre, color).
      - Java-ismo 6: Copia defensiva al recibir 'lados' y en el getter 'lados' para evitar fugas de encapsulamiento.
      - Java-ismo 7: Cálculo de perímetro mediante sum(...) generador en lugar de bucle for acumulador.
      - Corrección de type hint falso en area(): devuelve float coherente.
    """

    def __init__(
        self,
        nombre: str,
        color: str,
        lados: list[Lado] | None = None,
        observaciones: list[str] | None = None,
    ) -> None:
        super().__init__(nombre, color)
        # Copia defensiva al recibir colecciones
        self._lados: list[Lado] = list(lados) if lados is not None else []
        self._observaciones: list[str] = list(observaciones) if observaciones is not None else []

    def lados_esperados(self) -> int:
        return 0

    def perimetro(self) -> float:
        # Python idiomático: función generadora con sum
        return sum(l.longitud for l in self._lados)

    def area(self) -> float:
        return 0.0

    def agregar_observacion(self, texto: str) -> None:
        self._observaciones.append(texto)

    @property
    def observaciones(self) -> list[str]:
        return list(self._observaciones)

    @property
    def lados(self) -> list[Lado]:
        # Copia defensiva al exponer la colección interna
        return list(self._lados)

    # Método de compatibilidad para código previo
    def getLados(self) -> list[Lado]:
        return self.lados


class Triangulo(Poligono):
    """Subclase Triángulo con lados_esperados = 3.

    Corrección Java-ismo 8: Se elimina la sobrecarga manual simulada con *args e isinstance.
    Se define firma explícita con valores por defecto pythónicos.
    """

    def __init__(
        self,
        nombre: str = "Triángulo",
        color: str = "negro",
        lados: list[Lado] | None = None,
    ) -> None:
        super().__init__(nombre, color, lados)

    def lados_esperados(self) -> int:
        return 3


class Cuadrado(Poligono):
    """Subclase Cuadrado con lados_esperados = 4.

    Corrección Java-ismo 8: Firma limpia y predecible con argumentos por defecto.
    """

    def __init__(
        self,
        nombre: str = "Cuadrado",
        color: str = "negro",
        lados: list[Lado] | None = None,
    ) -> None:
        super().__init__(nombre, color, lados)

    def lados_esperados(self) -> int:
        return 4


if __name__ == "__main__":
    # Eliminación de ruido sintáctico (sin '== True', sin ';', con f-strings)
    activo = True
    if activo:
        t = Triangulo("Triángulo", "rojo", [Lado(3), Lado(4), Lado(5)])
        c = Cuadrado("Cuadrado", "azul", [Lado(2), Lado(2), Lado(2), Lado(2)])

        print(f"Perímetro del triángulo: {t.perimetro()}")
        print(f"Perímetro del cuadrado: {c.perimetro()}")

        t.agregar_observacion("revisar el vértice A")
        print(f"Observaciones del triángulo: {t.observaciones}")
        print(f"Nombre (atributo directo): {t.nombre}")
        print(f"Figura correctamente construida (super().__init__): {t._construida}")
