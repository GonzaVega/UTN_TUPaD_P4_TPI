# Programación IV — Primera Evaluación Parcial (POO)
## Sistema de Catálogo de Productos — Food Store

**Carrera:** Tecnicatura Universitaria en Programación (Modalidad a Distancia)  
**Materia:** Programación IV  
**Estudiante:** Gonzalo Vega  

---

## 1. Descripción del Proyecto

Este proyecto implementa el modelo orientado a objetos del catálogo de productos para el comercio **Food Store** en Python 3.12, cumpliendo con las pautas de diseño establecidas:

- **Encapsulamiento y propiedades:** Estado interno protegido mediante atributos con guion bajo simple (`_`), validaciones de dominio en la construcción y properties de solo lectura y derivadas (`disponible`, `precio_publicado`).
- **Relaciones estructurales:** Modelado observable de Composición (`Producto` a `ProductoCategoria`), Agregación (`ProductoCombo` a sus componentes) y Asociación (`Producto` a `UnidadMedida`), con colecciones protegidas mediante tuplas inmutables.
- **Herencia y polimorfismo:** Clase base abstracta `Producto` (`ABC`) con método abstracto `precio_final(cantidad)`, implementado polimórficamente por las subclases concretas (`ProductoSimple`, `ProductoPorPeso` y `ProductoCombo`) sin condicionales por tipo en el código cliente.
- **Decisión sobre ProductoDestacado:** Rediseño según el criterio «es-un», incorporando el orden de vidriera en `Producto` para permitir destacar cualquier tipo de producto del catálogo.
- **Contratos estructurales:** Contrato `Exportable` implementado con `typing.Protocol`, permitiendo exportar conjuntamente productos propios y fichas externas (`FichaPuntoDeVenta`) de forma polimórfica y sin modificar la librería de terceros.

---

## 2. Contenido de los Archivos

La estructura del proyecto respeta la organización solicitada:

- **`README.md`**: Descripción del proyecto, detalle de qué resuelve cada archivo e instrucciones de ejecución.
- **`catalogo.py`**: Módulo principal que contiene la totalidad del modelo de dominio (clases `UnidadMedida`, `Categoria`, `ProductoCategoria`, `Exportable`, `Producto`, `ProductoSimple`, `ProductoPorPeso`, `ProductoCombo`, la función `exportar_catalogo` y las excepciones de dominio al final del archivo).
- **`libreria_externa.py`**: Archivo provisto por la cátedra que contiene la clase `FichaPuntoDeVenta`. No se modifica en ninguna línea.
- **`main.py`**: Script ejecutable que instancia el catálogo, clasifica productos, asigna unidades de medida, calcula precios finales, demuestra las relaciones estructurales, valida fallas tempranas y exporta polimórficamente los datos por consola.
- **`link_video.txt`**: Archivo de texto plano para incorporar el enlace al video de defensa individual obligatorio.
- **`uml/modelo_final.md`**: Diagrama de clases final en formato Mermaid reflejando las decisiones de diseño adoptadas, junto con su fundamentación teórica.

---

## 3. Instrucciones de Ejecución

El proyecto requiere exclusivamente **Python 3.12 o superior** y su biblioteca estándar (`abc`, `dataclasses`, `typing`). No requiere la instalación de librerías externas ni la activación de entornos virtuales.

Para ejecutar la demostración, abrir una terminal en la raíz de esta carpeta y correr:

```bash
python3 main.py
```

o en Windows:

```bash
python main.py
```
