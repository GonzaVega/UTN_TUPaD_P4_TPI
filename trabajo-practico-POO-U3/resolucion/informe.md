# Informe Técnico — Trabajo Práctico Integrador POO

**Unidad 3: Programación Orientada a Objetos: de Java a Python**  
**Estudiante:** Gonzalo Vega  
**Materia:** Programación IV — TUPaD (UTN)

---

## 1. Diagnóstico de Java-ismos (Parte 1)

|  #  | Java-ismo | Dónde | Inversión | Síntoma |
| :-: | :--- | :--- | :--- | :--- |
| **1** | Getters preventivos sin lógica | `Figura.getNombre()`, `Figura.getColor()` | Compilador → Acuerdo | Ruido innecesario. En Python se accede directo al atributo. `@property` solo se usa cuando hay lógica. |
| **2** | Getter/Setter estilo JavaBean para validación | `Lado.getLongitud()`, `Lado.setLongitud()` | Compilador → Acuerdo | Obliga a sintaxis de método. En Python se reemplaza por `@property` + `@setter`, manteniendo la misma sintaxis de acceso (`lado.longitud`). |
| **3** | Atributo de clase mutable ("static" accidental) | `Poligono.catalogo = []` | Declaración → Runtime | La lista se crea una sola vez al definir la clase y la comparten todas las instancias, como una variable global. |
| **4** | Argumento por defecto mutable | `Poligono.__init__(..., lados=[], observaciones=[])` | Declaración → Runtime | El default se evalúa una sola vez. Todas las instancias creadas por defecto comparten la misma lista en memoria (`p1._observaciones is p2._observaciones` da `True`). |
| **5** | Omisión de `super().__init__()` | `Poligono.__init__()` | Declaración → Runtime | Python no llama al padre automáticamente. El objeto queda a medio construir: solo se inicializan los atributos de la hija. Falla en runtime cuando se accede a lo que el padre debía crear. |
| **6** | Fuga de encapsulamiento / Falta de copia defensiva | `Poligono.__init__()` y `Poligono.getLados()` | Compilador → Acuerdo | Se guarda y devuelve la referencia directa a la lista interna. Código externo puede mutarla sin pasar por la clase. Deben protegerse retornando una copia. |
| **7** | Bucle acumulador manual en lugar de generador | `Poligono.perimetro()` | Python idiomático | Bucle `for` con `total = total + ...`. En Python se escribe como `sum(l.longitud for l in self._lados)`. |
| **8** | Sobrecarga de constructores con `*args` / `isinstance` | `Triangulo.__init__()`, `Cuadrado.__init__()` | Herencia → Duck typing | Python no tiene sobrecarga por firma. Inspeccionar `len(args)` o tipos con `isinstance` es un antipatrón Java; se resuelve con parámetros por defecto. |

**Demostración de `@property`:** El único getter con lógica real era `Lado.getLongitud()` con validación de signo. Se convirtió en `@property` + `@longitud.setter`. El código cliente no cambia ninguna línea: antes `lado.getLongitud()`, ahora `lado.longitud` — misma sintaxis, validación invisible.

---

## 2. Relaciones Estructurales (Parte 2)

**Pregunta:** *Si la sintaxis de guardar la referencia es idéntica en los tres casos, ¿cómo se ve en el código la diferencia entre agregación y composición?*

La diferencia no está en la sintaxis sino en el **ciclo de vida**: quién construye la parte y quién controla su existencia.

1. **`Taller — Poligono` (Agregación `0..*`):** Lo delata `def recibir(self, poligono: Poligono)`. El polígono ya existía antes del taller y se le pasa por parámetro. Si el taller se destruye, los polígonos siguen vivos.

2. **`Poligono — Lado` (Composición `3..*`):** Lo delata que los `Lado` se construyen dentro del constructor: `[Lado(3), Lado(4), Lado(5)]`. El lado no tiene existencia fuera del polígono que lo delimita. Si el polígono se destruye, sus lados desaparecen con él.

3. **`Lado — Etiqueta` (Asociación `0..1`):** Lo delata `etiqueta: Etiqueta | None = None` en el constructor. La etiqueta es un metadato opcional que se vincula después y puede desasociarse sin afectar al lado.

**Copia defensiva:** `Poligono.lados()` y `Taller.inventario()` devuelven `tuple(self._lados)` y `tuple(self._poligonos)` respectivamente. De esta forma nadie puede mutar la colección interna desde afuera.

---

## 3. Herencia Justificada por Dominio (Parte 3)

`Poligono` es una clase abstracta (`ABC`) con `@abstractmethod lados_esperados()`. Si se intenta instanciarla directamente (o una subclase que no defina el método), Python lanza `TypeError` al construir el objeto — **falla temprana**.

**Decisión sobre `PoligonoRegular`:** En Java se usaba como clase base para satisfacer al compilador (para poder armar listas de tipo común o forzar firmas). En el dominio real, la regularidad no es un tipo de figura: es una condición de sus lados. Si la metemos en la jerarquía, no tiene sentido si un triángulo equilátero debe heredar de `Triangulo` o de `PoligonoRegular`.

**Decisión adoptada:** Se quita de la herencia. Se reemplaza por dos elementos en `Poligono`: `@property es_regular` (calcula si todos los lados miden lo mismo) y `@classmethod regular(medida_lado)` en cada subclase (construye la figura con lados iguales sin necesidad de una clase extra).

---

## 4. ABC vs. Protocol (Parte 4)

**¿Por qué una ABC no servía para `PlanoCAD` sin modificarla?** Una ABC requiere herencia explícita (`class PlanoCAD(Exportable): ...`). Como `PlanoCAD` es de una librería externa que no podemos editar, una ABC nos obligaría a modificar código ajeno.

`Exportable` se implementa como `Protocol` (*duck typing* tipado): alcanza con que la clase tenga el método `exportar() -> str`, sin importar de quién hereda. `PlanoCAD` lo satisface de forma automática.

**¿Lo decide el lenguaje o el dominio?** Lo decide el **dominio**:
- `Poligono` usa **ABC** porque es una familia propia: las subclases comparten estado y código real, y queremos falla temprana si alguien olvida definir sus lados.
- `Exportable` usa **Protocol** porque exportar es una capacidad que cruza fronteras entre código propio y de terceros, sin que deban conocerse ni acoplarse.

---

## 5. Tabla de Equivalencias Java → Python (Parte 5)

| Elemento en Java | En Python | ¿Traducción directa o rediseño? | Por qué |
| :--- | :--- | :---: | :--- |
| `private nombre, color` + getters sin lógica | `self.nombre`, `self.color` | Rediseño | Sin compilador que lo exija, el acceso directo es la convención. |
| `getLongitud()` / `setLongitud()` con validación | `@property longitud` + `@setter` | Rediseño | Misma sintaxis de acceso con validación invisible al cliente. |
| `getLados()` devolviendo la lista interna | `def lados() -> tuple[Lado, ...]` | Rediseño | `final` en Java no protege el contenido; se devuelve copia defensiva. |
| `abstract class Poligono` + `abstract ladosEsperados()` | `class Poligono(Figura, ABC)` + `@abstractmethod` | Traducción directa | Misma relación «es-un» y misma falla temprana. |
| `for (Lado l : lados) { total += l.getLongitud(); }` | `sum(l.longitud for l in self._lados)` | Traducción directa | Generador con `sum()` reemplaza el bucle acumulador. |
| Sobrecarga de constructores `Triangulo()`, `Triangulo(lados)` | Parámetros por defecto y `@classmethod regular()` | Rediseño | Python no admite sobrecarga por firma. |
| `interface Exportable` + `implements` | `class Exportable(Protocol)` | Rediseño | `PlanoCAD` no puede heredar de nuestro código; el Protocol lo satisface sin saberlo. |

**Cierre:** Lo que se mantuvo idéntico es el diseño del modelo: las relaciones composición/agregación/asociación, la jerarquía de figuras y las responsabilidades de cada clase. Lo que cambió fue cómo se expresa: desapareció la ceremonia del compilador (getters vacíos, constructores sobrecargados, `PoligonoRegular` como clase intermedia) y quedó código que dice exactamente lo que hace.
