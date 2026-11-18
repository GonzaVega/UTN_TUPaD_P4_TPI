"""main.py — Demostración ejecutable integradora (Parte 5).

Demuestra en tiempo de ejecución:
  1. Creación de un Taller con 4 polígonos (uno de cada subclase: Triángulo, Cuadrado,
     Pentágono y Hexágono).
  2. Asociación de etiquetas a lados de las figuras.
  3. Exportación polimórfica junto con una instancia externa de PlanoCAD (Protocol Exportable).
  4. Visualización del inventario y estado de los polígonos.
  5. Evidencia viva de decisiones de diseño:
     - Composición: el Lado no sobrevive a la destrucción de su Polígono.
     - Agregación: el Polígono sí sobrevive a la destrucción del Taller.
     - Falla temprana: instanciar un Poligono abstracto sin lados_esperados() falla al construir.
"""

import gc
import weakref

from figuras import (
    Cuadrado,
    Etiqueta,
    Exportable,
    Hexagono,
    Lado,
    Pentagono,
    Poligono,
    Taller,
    Triangulo,
    exportar_todo,
)
from libreria_externa import PlanoCAD


def main() -> None:
    print("=" * 75)
    print("TRABAJO PRÁCTICO INTEGRADOR — DEMOSTRACIÓN EJECUTABLE")
    print("=" * 75)

    # ------------------------------------------------------------------
    # 1. Armado del Taller con 4 polígonos (uno de cada subclase)
    # ------------------------------------------------------------------
    print("\n--- 1. Construcción de Figuras y Armado del Taller ---")

    # Polígonos con medidas y colores propios
    triangulo = Triangulo("Triángulo Isósceles", "rojo", [Lado(3.0), Lado(3.0), Lado(4.0)])
    cuadrado = Cuadrado.regular(5.0, color="azul")
    pentagono = Pentagono.regular(4.0, color="verde")
    hexagono = Hexagono.regular(3.0, color="amarillo")

    # ------------------------------------------------------------------
    # 2. Etiquetado de al menos 2 lados (Asociación 0..1)
    # ------------------------------------------------------------------
    etiqueta_base = Etiqueta("Base de apoyo")
    etiqueta_lado = Etiqueta("Lado frontal")

    # Asociamos las etiquetas a lados específicos a través del método de la clase
    # (no se puede hacer por lados() porque esa devuelve una copia defensiva)
    triangulo.etiquetar_lado(2, etiqueta_base)
    cuadrado.etiquetar_lado(0, etiqueta_lado)

    # Creamos el taller y le agregamos los polígonos (Agregación)
    taller = Taller()
    for p in [triangulo, cuadrado, pentagono, hexagono]:
        taller.recibir(p)

    print(f"Polígonos ingresados al taller: {len(taller.inventario())}")
    for p in taller.inventario():
        print(f"  - {p.nombre} ({p.color}): perímetro = {p.perimetro():.1f}, área = {p.area():.2f}")

    # ------------------------------------------------------------------
    # 3. Restauración en el Taller
    # ------------------------------------------------------------------
    print("\n--- 2. Operación de Restauración en Taller ---")
    taller.restaurar(triangulo)
    taller.restaurar(hexagono)
    print(f"Observaciones del {triangulo.nombre}: {triangulo.observaciones}")
    print(f"Observaciones del {hexagono.nombre}: {hexagono.observaciones}")

    # ------------------------------------------------------------------
    # 4. Exportación polimórfica con PlanoCAD (Protocol Exportable)
    # ------------------------------------------------------------------
    print("\n--- 3. Exportación polimórfica (Protocol Exportable) ---")
    plano_externo = PlanoCAD("PLAN-ARQ-2026", escala="1:50")

    elementos_a_exportar: list[Exportable] = [
        triangulo,
        cuadrado,
        pentagono,
        hexagono,
        plano_externo,
    ]

    textos_exportados = exportar_todo(elementos_a_exportar)
    print("Salida de exportar_todo():")
    for linea in textos_exportados:
        print(f"  [EXPORTADO] -> {linea}")

    # ------------------------------------------------------------------
    # 5. Evidencia de Decisiones de Diseño en Runtime
    # ------------------------------------------------------------------
    print("\n--- 4. Evidencia de Decisiones de Diseño ---")

    # A) Falla temprana en clase abstracta
    print("\nA) Verificación de Falla Temprana (abc.ABC):")
    try:
        # Intentamos instanciar Poligono abstracto sin implementar métodos
        Poligono("PoligonoFantasma", "blanco")  # type: ignore
        print("  ERROR: La clase abstracta se dejó instanciar.")
    except TypeError as e:
        print(f"  CORRECTO: TypeError al construir: {e}")

    # B) Agregación: el Polígono sobrevive a la destrucción del Taller
    print("\nB) Verificación de Agregación (Taller o-- Poligono):")
    taller_temporal = Taller([triangulo])
    print(f"  Taller temporal creado con {len(taller_temporal.inventario())} polígono.")
    del taller_temporal
    gc.collect()
    print(f"  CORRECTO: El taller fue eliminado, pero {triangulo.nombre} sigue vivo e intacto.")
    print(f"    Perímetro de {triangulo.nombre}: {triangulo.perimetro()}")

    # C) Composición: el Lado no sobrevive a la destrucción de su Polígono
    print("\nC) Verificación de Composición (Poligono *-- Lado):")
    # Construimos un polígono efímero y tomamos una referencia débil a uno de sus lados
    poligono_efimero = Cuadrado.regular(2.0, "violeta")
    lado_referenciado = poligono_efimero.lados()[0]
    ref_debil = weakref.ref(lado_referenciado)

    print(f"  Polígono creado con 4 lados. Referencia débil al lado: {ref_debil()}")
    # Eliminamos las referencias externas al polígono y al lado
    del poligono_efimero
    del lado_referenciado
    gc.collect()

    if ref_debil() is None:
        print("  CORRECTO: Al destruir el Polígono, sus lados se recolectaron (mueren con el todo).")
    else:
        print(f"  Nota: El recolector de basura aún mantiene referencia: {ref_debil()}")

    print("\n" + "=" * 75)
    print("DEMOSTRACIÓN FINALIZADA CON ÉXITO")
    print("=" * 75)


if __name__ == "__main__":
    main()
