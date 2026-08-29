# Trabajo Práctico Integrador — Unidad 3 (POO)

## De Java a Python: Programación Orientada a Objetos por Equivalencia

**Materia:** Programación IV — TUPaD (UTN)  
**Estudiante:** Gonzalo Vega

---

## Estructura del Proyecto y Contenido de los Archivos

El proyecto está organizado según las pautas de entrega oficiales de la cátedra:

```text
resolucion/
├── README.md              # Este archivo: descripción del proyecto y roles de cada componente
├── figuras.py             # Dominio completo del modelo POO (Partes 1 a 4)
├── parte1_diagnostico.py  # Archivo de partida original corregido (sin java-ismos ni ruido)
├── demo_sintomas.py       # Demostración reproducible de 2 síntomas de java-ismos (Parte 1)
├── libreria_externa.py    # Clase de un tercero (PlanoCAD), provista por la cátedra sin modificar
├── main.py                # Script ejecutable integrador con verificación de diseño en runtime
├── informe.md             # Informe técnico completo (tablas, justificaciones y preguntas)
└── uml/
    └── modelo_final.md    # Diagrama de clases final en Mermaid y justificación de modelado
```

### Descripción detallada de cada archivo:

1. **`figuras.py`**:
   - Contiene la resolución integral del dominio geométrico.
   - Define:
     - `Etiqueta`: Objeto-valor inmutable implementado con `@dataclass(frozen=True)`.
     - `Lado`: Entidad con validación de longitud mediante `@property` y `@longitud.setter`, método `escalar()` y asociación opcional `0..1` a `Etiqueta`.
     - `Figura`: Clase base abstracta (`ABC`) con método abstracto `area()`.
     - `Poligono`: Clase abstracta (`ABC`) con `@abstractmethod lados_esperados()`, composición hacia `Lado` (`3..*`), copia defensiva inmutable en `lados()`, método `etiquetar_lado(indice, etiqueta)` para asignar etiquetas de forma controlada sobre la lista interna, validación estructural y rediseño de regularidad (`@property es_regular`).
     - Subclases concretas: `Triangulo` (3), `Cuadrado` (4), `Pentagono` (5) y `Hexagono` (6) con sus respectivos cálculos de área, lados esperados, y `@classmethod regular(medida_lado)` para construir instancias con todos los lados iguales.
     - `Taller`: Clase que implementa agregación (`0..*`) hacia `Poligono`, recibiendo polígonos ya construidos externamente y aplicando copia defensiva en `inventario()`.
     - `Exportable` y `exportar_todo()`: Protocolo estructural (`typing.Protocol`) y función polimórfica que exporta simultáneamente figuras y planos CAD externos.

2. **`parte1_diagnostico.py`**:
   - Versión corregida y saneada del código de partida.
   - Corrige los 8 java-ismos de diseño identificados y elimina el ruido sintáctico (sin `;`, sin comparaciones contra `True`, usando f-strings e inicialización explícita).

3. **`demo_sintomas.py`**:
   - Script independiente que reproduce dos síntomas concretos de los java-ismos antes de su solución:
     - **Síntoma 1**: Argumentos mutables por defecto en `__init__`, evidenciando cómo dos instancias comparten la misma lista en memoria (`is -> True`).
     - **Síntoma 2**: Omisión de `super().__init__()`, evidenciando el `AttributeError` al consultar atributos que el padre debía inicializar (`_construida`).

4. **`libreria_externa.py`**:
   - Archivo entregado por la cátedra que simula un paquete de terceros con la clase `PlanoCAD`. No se modifica nunca.

5. **`main.py`**:
   - Script de demostración integradora.
   - Instancia un taller con un polígono de cada subclase, asocia etiquetas, ejecuta `exportar_todo()` junto con `PlanoCAD` y evidencia en tiempo de ejecución:
     - La falla temprana al intentar instanciar una clase abstracta sin implementar métodos obligatorios (`TypeError`).
     - La agregación: los polígonos sobreviven a la destrucción del taller.
     - La composición: los lados mueren con la destrucción de su polígono.

6. **`informe.md`**:
   - Documento técnico con:
     - Tabla de los 8 java-ismos de diseño identificados, su ubicación e inversión conceptual.
     - Demostración de código cliente de `@property` antes y después.
     - Respuesta a la pregunta obligatoria sobre la distinción en código entre Agregación y Composición.
     - Justificación del rediseño y eliminación de `PoligonoRegular` de la jerarquía de herencia.
     - Respuesta a la pregunta «¿Lo decide el lenguaje o el dominio?» (ABC vs. Protocol).
     - Tabla de equivalencias (7 elementos de nuestro código comparando Java vs. Python).
     - Cierre de la unidad analizando qué parte del modelo cambió y qué parte se mantuvo idéntica.

7. **`uml/modelo_final.md`**:
   - Diagrama de clases final en formato Mermaid renderizable en VS Code / GitLab / GitHub.
   - Modela herencia, composición (`*--`), agregación (`o--`), asociación (`-->`) y contratos estructurales (`..|>`).

---

## Verificación Previa a la Entrega

Para ejecutar las pruebas del proyecto:

```bash
# 1. Demostración de síntomas (Parte 1)
python demo_sintomas.py

# 2. Demostración integradora completa (Parte 5)
python main.py

# 3. Verificación de parte1 corregida
python parte1_diagnostico.py
```
