"""
Script de verificación automatizada del backend FastAPI con SQLModel y PostgreSQL.
Prueba cada uno de los requisitos:
- HU-01: CRUD contra PostgreSQL
- HU-02: Validaciones Pydantic y reglas de negocio (409 y 422)
- RN-02: Nombre obligatorio y no vacío
- RN-03: Precio >= 0
- RN-04: 404 al consultar/actualizar/eliminar inexistente
- RN-05: Persistencia en base de datos
"""

import sys
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_crud_and_business_rules():
    print("Iniciando pruebas de integración...")

    # 1. Root
    res = client.get("/")
    assert res.status_code == 200, f"Root error: {res.text}"

    # 2. Validación: Nombre solo espacios -> 422 (RN-02)
    res = client.post("/productos/", json={
        "nombre": "   ",
        "precio": 10.0,
        "stock": 5
    })
    assert res.status_code == 422, f"Expected 422 on empty name, got {res.status_code}"
    print("✔ RN-02: Rechazo de nombre vacío (422) verificado.")

    # 3. Validación: Precio negativo -> 422 (RN-03)
    res = client.post("/productos/", json={
        "nombre": "Producto Invalido",
        "precio": -5.0,
        "stock": 5
    })
    assert res.status_code == 422, f"Expected 422 on negative price, got {res.status_code}"
    print("✔ RN-03: Rechazo de precio negativo (422) verificado.")

    # 4. Crear Producto exitoso -> 201 (HU-01)
    test_prod_name = "Monitor UltraWide 34 Test"
    res = client.post("/productos/", json={
        "nombre": test_prod_name,
        "descripcion": "Monitor curvo para desarrollo",
        "categoria": "Electrónica",
        "precio": 450.0,
        "stock": 2,
        "stock_minimo": 5,
        "activo": True
    })
    assert res.status_code == 201, f"Expected 201, got {res.status_code}: {res.text}"
    prod_data = res.json()
    prod_id = prod_data["id"]
    assert prod_data["nombre"] == test_prod_name
    print(f"✔ HU-01: Producto creado con ID {prod_id} (201).")

    # 5. Conflicto: Nombre duplicado -> 409 (HU-02)
    res = client.post("/productos/", json={
        "nombre": test_prod_name,
        "precio": 500.0
    })
    assert res.status_code == 409, f"Expected 409 on duplicate name, got {res.status_code}"
    print("✔ HU-02: Regla de negocio nombre duplicado (409) verificada.")

    # 6. Detalle por ID existente -> 200
    res = client.get(f"/productos/{prod_id}")
    assert res.status_code == 200
    assert res.json()["id"] == prod_id
    print("✔ GET detalle producto por ID (200) verificado.")

    # 7. Detalle por ID inexistente -> 404 (RN-04)
    res = client.get("/productos/9999999")
    assert res.status_code == 404
    print("✔ RN-04: Producto inexistente devuelve 404 verificado.")

    # 8. Consultar Stock (regla de stock < stock_minimo) -> 200
    res = client.get(f"/productos/{prod_id}/stock")
    assert res.status_code == 200
    stock_info = res.json()
    assert stock_info["bajo_stock_minimo"] is True  # stock=2 < stock_minimo=5
    print("✔ Consulta de stock y cálculo de bajo_stock_minimo verificado.")

    # 9. Actualizar producto -> 200
    res = client.put(f"/productos/{prod_id}", json={
        "precio": 420.0,
        "stock": 10
    })
    assert res.status_code == 200
    assert res.json()["precio"] == 420.0
    assert res.json()["stock"] == 10
    print("✔ PUT actualización de producto (200) verificado.")

    # 10. Desactivar (borrado lógico) -> 200
    res = client.put(f"/productos/{prod_id}/desactivar")
    assert res.status_code == 200
    assert res.json()["activo"] is False
    print("✔ PUT desactivar producto (borrado lógico) verificado.")

    # 11. Eliminar físicamente -> 200 (RN-05)
    res = client.delete(f"/productos/{prod_id}")
    assert res.status_code == 200
    print("✔ DELETE producto físico en PostgreSQL verificado.")

    # 12. Verificar que ya no existe -> 404 (RN-04)
    res = client.get(f"/productos/{prod_id}")
    assert res.status_code == 404
    print("✔ Comprobación post-eliminación (404) verificada.")

    print("\n✅ TODAS LAS PRUEBAS DE BACKEND PASARON EXITOSAMENTE.")


if __name__ == "__main__":
    test_crud_and_business_rules()
