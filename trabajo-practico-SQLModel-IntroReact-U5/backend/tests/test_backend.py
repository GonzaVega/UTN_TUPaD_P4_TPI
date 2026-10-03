import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_crud_and_business_rules():
    res = client.get("/")
    assert res.status_code == 200, f"Root error: {res.text}"

    res = client.post("/productos/", json={
        "nombre": "   ",
        "precio": 10.0,
        "stock": 5
    })
    assert res.status_code == 422, f"Expected 422 on empty name, got {res.status_code}"

    res = client.post("/productos/", json={
        "nombre": "Producto Invalido",
        "precio": -5.0,
        "stock": 5
    })
    assert res.status_code == 422, f"Expected 422 on negative price, got {res.status_code}"

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

    res = client.post("/productos/", json={
        "nombre": test_prod_name,
        "precio": 500.0
    })
    assert res.status_code == 409, f"Expected 409 on duplicate name, got {res.status_code}"

    res = client.get(f"/productos/{prod_id}")
    assert res.status_code == 200
    assert res.json()["id"] == prod_id

    res = client.get("/productos/9999999")
    assert res.status_code == 404

    res = client.get(f"/productos/{prod_id}/stock")
    assert res.status_code == 200
    stock_info = res.json()
    assert stock_info["bajo_stock_minimo"] is True

    res = client.put(f"/productos/{prod_id}", json={
        "precio": 420.0,
        "stock": 10
    })
    assert res.status_code == 200
    assert res.json()["precio"] == 420.0
    assert res.json()["stock"] == 10

    res = client.put(f"/productos/{prod_id}/desactivar")
    assert res.status_code == 200
    assert res.json()["activo"] is False

    res = client.delete(f"/productos/{prod_id}")
    assert res.status_code == 200

    res = client.get(f"/productos/{prod_id}")
    assert res.status_code == 404


if __name__ == "__main__":
    test_crud_and_business_rules()
