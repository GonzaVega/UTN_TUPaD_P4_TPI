"""demo_sintomas.py — Demostración reproducible de 2 java-ismos (Parte 1).

Este script demuestra en tiempo de ejecución los síntomas indeseados que producían
las decisiones de diseño heredadas de Java en el código de partida:

  1. Default mutable compartido en constructores (lados=[] y observaciones=[]).
  2. Omisión de super().__init__() que deja al objeto a medio construir.

Ambos se manifiestan sin errores de sintaxis, pero rompen la semántica del dominio.
"""


def demostrar_sintoma_1_default_mutable():
    print("=" * 70)
    print("SÍNTOMA 1: Default mutable compartido (Poligono.__init__)")
    print("=" * 70)
    print("En Java, new ArrayList<>() en una sobrecarga se ejecuta en cada llamada.")
    print("En Python, el default [] se evalúa una sola vez al definir la función.\n")

    # Reproducción fiel del constructor defectuoso original:
    class PoligonoDefectuoso:
        def __init__(self, nombre, color, observaciones=[]):
            self.nombre = nombre
            self.color = color
            self._observaciones = observaciones

        def agregar_observacion(self, obs: str):
            self._observaciones.append(obs)

    p1 = PoligonoDefectuoso("Triángulo 1", "rojo")
    p2 = PoligonoDefectuoso("Triángulo 2", "azul")

    print(f"Estado inicial p1._observaciones: {p1._observaciones}")
    print(f"Estado inicial p2._observaciones: {p2._observaciones}")

    print("\nAcción: p1.agregar_observacion('Revisar vértice A')")
    p1.agregar_observacion("Revisar vértice A")

    print(f"Resultado p1._observaciones: {p1._observaciones}")
    print(f"Resultado p2._observaciones: {p2._observaciones}  <-- Contaminado")

    identidad_compartida = p1._observaciones is p2._observaciones
    print(f"\n¿p1._observaciones is p2._observaciones?: {identidad_compartida}")
    print("--> EVIDENCIA: Ambas instancias apuntan exactamente a la misma lista en memoria.")
    print("Solución pythónica: usar 'observaciones=None' y 'self._observaciones = [] if observaciones is None else list(observaciones)'.\n")


def demostrar_sintoma_2_super_olvidado():
    print("=" * 70)
    print("SÍNTOMA 2: Omisión de super().__init__() en Poligono")
    print("=" * 70)
    print("En Java, el compilador inserta super() de forma invisible.")
    print("En Python, si no se invoca super().__init__(), el constructor padre no corre.\n")

    class FiguraOriginal:
        def __init__(self, nombre, color):
            self._nombre = nombre
            self._color = color
            self._construida = True  # Agregamos una flag para verificar si el constructor se ejecutó

    class PoligonoSinSuper(FiguraOriginal):
        def __init__(self, nombre, color):
            # Omitió super().__init__(nombre, color) y reasignó a mano:
            self._nombre = nombre
            self._color = color

    p = PoligonoSinSuper("Polígono Incompleto", "verde")

    print("Intentando acceder a p._construida (atributo garantizado por Figura)...")
    try:
        valor = p._construida  
        print(f"Valor: {valor}") #Aca se evidenciara que no se construyo el objeto incluyendo el constructor padre.
    except AttributeError as e:
        print(f"--> ERROR CAPTURADO: AttributeError: {e}")
        print("--> EVIDENCIA: El objeto quedó a medio construir porque Figura.__init__ jamás se ejecutó.")
        print("Solución pythónica: invocar siempre 'super().__init__(nombre, color)' en la primera línea de __init__.\n")


if __name__ == "__main__":
    print("\nTRABAJO PRÁCTICO INTEGRADOR - UNIDAD 3 (POO)")
    print("Demostración de Síntomas de Java-ismos en Python\n")
    demostrar_sintoma_1_default_mutable()
    demostrar_sintoma_2_super_olvidado()
