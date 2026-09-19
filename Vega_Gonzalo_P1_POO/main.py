from dataclasses import FrozenInstanceError
from libreria_externa import FichaPuntoDeVenta
from catalogo import (
    UnidadMedida,
    Categoria,
    Producto,
    ProductoSimple,
    ProductoPorPeso,
    ProductoCombo,
    exportar_catalogo,
    ErrorDominio,
)


def separador(titulo: str) -> None:
  print("\n" + "=" * 75)
  print(f"  {titulo.upper()}")
  print("=" * 75)


def main() -> None:
  print("\n" + "#" * 75)
  print("  FOOD STORE — SISTEMA DE GESTIÓN DE CATÁLOGO")
  print("  Demostración de Principios POO, Relaciones y Contratos")
  print("#" * 75)

  # =========================================================================
  # 1. UNIDADES DE MEDIDA Y CATEGORÍAS (HU-P1-01)
  # =========================================================================
  separador("1. Unidades de Medida y Categorías")

  u_unidad = UnidadMedida("Unidad", "u", "unidad")
  u_kg = UnidadMedida("Kilogramo", "kg", "masa")
  u_litro = UnidadMedida("Litro", "L", "volumen")

  print(f"[OK] Unidad de medida creada: {u_unidad.nombre} ({u_unidad.simbolo})")
  print(f"[OK] Unidad de medida creada: {u_kg.nombre} ({u_kg.simbolo})")
  print(f"[OK] Unidad de medida creada: {u_litro.nombre} ({u_litro.simbolo})")

  try:
    u_unidad.simbolo = "pza"
  except FrozenInstanceError:
    print("[DEMO INMUTABILIDAD] Intentar modificar UnidadMedida lanzó FrozenInstanceError correctamente.")

  cat_bebidas = Categoria("Bebidas", "Gaseosas, aguas y jugos")
  cat_almacen = Categoria("Almacén", "Comestibles secos e infusiones")
  cat_fiambreria = Categoria("Fiambrería", "Quesos, embutidos y fiambres al corte")
  cat_promos = Categoria("Promociones", "Combos especiales y ofertas del mes")

  print(f"[OK] Categoría creada: {cat_bebidas.nombre} — {cat_bebidas.descripcion}")
  print(f"[OK] Categoría creada: {cat_almacen.nombre} — {cat_almacen.descripcion}")
  print(f"[OK] Categoría creada: {cat_fiambreria.nombre} — {cat_fiambreria.descripcion}")
  print(f"[OK] Categoría creada: {cat_promos.nombre} — {cat_promos.descripcion}")

  # =========================================================================
  # 2. COMPONENTES Y PRODUCTOS DEL CATÁLOGO (HU-P1-01, HU-P1-02, HU-P1-03)
  # =========================================================================
  separador("2. Registro de Productos en el Catálogo")

  fideos = ProductoSimple("Fideos Tallarines 500g", 1200.0, 40.0, cat_almacen, u_unidad)
  salsa = ProductoSimple("Salsa de Tomate Lista", 900.0, 30.0, cat_almacen, u_unidad)

  gaseosa = ProductoSimple("Gaseosa Cola 1.5L", 2200.0, 50.0, cat_bebidas, u_litro)
  aceite = ProductoSimple("Aceite de Girasol 900ml", 1850.0, 25.0, cat_almacen, u_unidad)
  queso_cremoso = ProductoPorPeso("Queso Cremoso", 8500.0, 15.5, cat_fiambreria, u_kg)
  jamon_cocido = ProductoPorPeso("Jamón Cocido Premium", 12000.0, 8.0, cat_fiambreria, u_kg)

  combo_pasta = ProductoCombo(
      nombre="Combo Pasta Casera (Fideos + Salsa)",
      categoria_principal=cat_promos,
      componentes=[fideos, salsa],
      descuento=0.15,
      unidad_venta=u_unidad,
  )

  catalogo: list[Producto] = [gaseosa, aceite, queso_cremoso, jamon_cocido, combo_pasta]

  for p in catalogo:
    print(f"-> {p.nombre:<40} | Base: {p.precio_publicado:<15} | Stock: {p.stock_cantidad:>4} | Cat. Principal: {p.categoria_principal().nombre}")

  # =========================================================================
  # 3. RELACIÓN DE COMPOSICIÓN: Producto y ProductoCategoria (HU-P1-02)
  # =========================================================================
  separador("3. Demostración de Composición (Producto -> ProductoCategoria)")

  print(f"Producto analizado: {gaseosa.nombre}")
  print(f"  Categoría principal inicial: {gaseosa.categoria_principal().nombre}")

  gaseosa.clasificar_en(cat_promos, es_principal=False)
  print(f"  Clasificado adicionalmente en '{cat_promos.nombre}' (es_principal=False).")
  print(f"  Total clasificaciones: {len(gaseosa.categorias())} (Principal actual: {gaseosa.categoria_principal().nombre})")

  gaseosa.clasificar_en(cat_almacen, es_principal=True)
  print(f"  Clasificado en '{cat_almacen.nombre}' con es_principal=True.")
  print(f"  [INVARIANTE] Nueva categoría principal: {gaseosa.categoria_principal().nombre}")

  tupla_cats = gaseosa.categorias()
  try:
    tupla_cats.append("vínculo falso")  
  except AttributeError:
    print("  [DEMO ENCAPSULAMIENTO] categorias() devuelve una tupla; append() lanzó AttributeError.")

  try:
    gaseosa.clasificar_en(cat_almacen)
  except ErrorDominio as err:
    print(f"  [DEMO ERROR DOMINIO] Clasificar duplicado lanzó ErrorDominio: '{err}'")

  # =========================================================================
  # 4. RELACIÓN DE AGREGACIÓN: ProductoCombo y Componentes (HU-P1-02, HU-P1-03)
  # =========================================================================
  separador("4. Demostración de Agregación (ProductoCombo -> Producto)")

  print(f"Combo: {combo_pasta.nombre}")
  print(f"  Componentes agregados ({len(combo_pasta.componentes())}):")
  for comp in combo_pasta.componentes():
    print(f"    - {comp.nombre} (Stock: {comp.stock_cantidad})")

  print(f"  Precio base calculado (suma sin descuento): $ {combo_pasta.precio_base:.2f}")
  print(f"  Stock derivado del combo (mínimo de componentes): {combo_pasta.stock_cantidad}")

  print("\n  Destruyendo la instancia de 'combo_pasta'...")
  del combo_pasta
  print(f"  [SOBREVIDA AGREGACIÓN] {fideos.nombre} sigue existiendo intacto con stock {fideos.stock_cantidad}.")
  print(f"  [SOBREVIDA AGREGACIÓN] {salsa.nombre} sigue existiendo intacto con stock {salsa.stock_cantidad}.")

  nuevo_combo = ProductoCombo(
    nombre="Combo Familiar de Pastas",
    categoria_principal=cat_promos,
    componentes=[fideos, salsa],
    descuento=0.20,
  )
  catalogo[-1] = nuevo_combo
  print(f"  [REUTILIZACIÓN] Componentes reagrupados exitosamente en: '{nuevo_combo.nombre}'")

  # =========================================================================
  # 5. DISPONIBILIDAD Y CONTROL DE ESTADO (HU-P1-01)
  # =========================================================================
  separador("5. Control de Disponibilidad (habilitar / deshabilitar)")

  print(f"Estado inicial de '{aceite.nombre}': disponible = {aceite.disponible}")
  aceite.deshabilitar()
  print(f"Luego de deshabilitar(): disponible = {aceite.disponible}")
  aceite.habilitar()
  print(f"Luego de habilitar(): disponible = {aceite.disponible}")

  # =========================================================================
  # 6. CÁLCULO POLIMÓRFICO DE PRECIOS FINALES (HU-P1-03)
  # =========================================================================
  separador("6. Cálculo Polimórfico de Precios Finales (sin isinstance ni if/elif)")

  cantidades_prueba = [
    (gaseosa, 3.0),          
    (aceite, 2),             
    (queso_cremoso, 0.450),  
    (jamon_cocido, 0.250),   
    (nuevo_combo, 2),        
  ]

  for prod, cant in cantidades_prueba:
    total = prod.precio_final(cant)
    unidad_str = prod.unidad_venta.simbolo if prod.unidad_venta else "unid."
    print(f"Producto: {prod.nombre:<35} | Cantidad: {cant:>5} {unidad_str:<3} | Total: $ {total:>9.2f}")

  print("\nDemostración de validaciones de cantidad:")
  try:
    gaseosa.precio_final(1.5) 
  except ErrorDominio as err:
    print(f"  [VALIDACIÓN] ProductoSimple con decimales lanzó: '{err}'")

  try:
    queso_cremoso.precio_final(-0.5)  
  except ErrorDominio as err:
    print(f"  [VALIDACIÓN] ProductoPorPeso con cantidad negativa lanzó: '{err}'")

  # =========================================================================
  # 7. DECISIÓN DE DISEÑO: ProductoDestacado (Decisión A2 / HU-P1-05)
  # =========================================================================
  separador("7. Decisión sobre ProductoDestacado (A2: Atributo en Producto)")

  print("Destacando productos de diferentes tipos en vidriera:")
  queso_cremoso.destacar(orden=1)
  nuevo_combo.destacar(orden=2)
  gaseosa.destacar(orden=3)

  print(f"  -> {queso_cremoso.nombre} (Tipo: PorPeso) | Orden vidriera: {queso_cremoso.orden_vidriera}")
  print(f"  -> {nuevo_combo.nombre} (Tipo: Combo)   | Orden vidriera: {nuevo_combo.orden_vidriera}")
  print(f"  -> {gaseosa.nombre} (Tipo: Simple)  | Orden vidriera: {gaseosa.orden_vidriera}")

  queso_cremoso.quitar_destacado()
  print(f"  Luego de quitar_destacado(): {queso_cremoso.nombre} orden = {queso_cremoso.orden_vidriera}")

  # =========================================================================
  # 8. FALLA TEMPRANA AL INSTANCIAR CLASES ABSTRACTAS (HU-P1-03)
  # =========================================================================
  separador("8. Falla Temprana al Instanciar Clases Abstractas o Incompletas")

  try: 
    Producto("Producto Abstracto", 100.0, 10.0, cat_almacen)  # El IDE ya nos advierte el error.
  except TypeError as err:
    print(f"  [FALLA TEMPRANA 1] Instanciar Producto (ABC) lanzó TypeError al construir:\n    -> {err}")
  class ProductoSinPrecioFinal(Producto):
    pass

  try:
    ProductoSinPrecioFinal("Subclase Inválida", 50.0, 5.0, cat_almacen) # El IDE ya nos advierte el error.
  except TypeError as err:
    print(f"  [FALLA TEMPRANA 2] Instanciar subclase incompleta lanzó TypeError al construir:\n    -> {err}")

  # =========================================================================
  # 9. EXPORTACIÓN POLIMÓRFICA CON LIBRERÍA EXTERNA (HU-P1-04)
  # =========================================================================
  separador("9. Exportación Polimórfica (Protocol Exportable + Terceros)")

  ficha_1 = FichaPuntoDeVenta("POS-101", "Caja 1 - Turno Mañana")
  ficha_2 = FichaPuntoDeVenta("POS-102", "Caja 2 - Turno Tarde")

  items_exportables = [
    gaseosa,
    aceite,
    queso_cremoso,
    jamon_cocido,
    nuevo_combo,
    ficha_1,
    ficha_2,
  ]

  lineas_exportadas = exportar_catalogo(items_exportables)

  print(f"Total de elementos exportados en una sola operación: {len(lineas_exportadas)}\n")
  for linea in lineas_exportadas:
    print(f"  [EXPORTADO] {linea}")

  separador("Fin de la Demostración — Catálogo Food Store")


if __name__ == "__main__":
  main()
