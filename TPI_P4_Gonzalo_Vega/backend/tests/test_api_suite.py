from fastapi.testclient import TestClient
from app.core.database import create_all_tables
from app.db.seed import seed_database
from app.main import app

client = TestClient(app)

def setup_module():
    create_all_tables()
    seed_database()

def test_01_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Food Store" in data["mensaje"]
    assert data["documentacion"] == "/docs"

def test_02_login_admin():
    response = client.post(
        "/api/v1/auth/token",
        data={"username": "admin", "password": "Admin1234!"},
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Login exitoso"
    assert "access_token" in response.cookies

def test_03_login_bad_credentials():
    response = client.post(
        "/api/v1/auth/token",
        data={"username": "admin", "password": "WrongPassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Credenciales incorrectas"

def test_04_register_client():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "cliente_test",
            "full_name": "Cliente de Prueba",
            "email": "cliente_test@foodstore.com",
            "password": "Password123!",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "cliente_test"
    assert data["role"] == "user"
    assert data["disabled"] is False
    assert "hashed_password" not in data

def test_05_register_duplicate_username_and_email():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "cliente_test",
            "full_name": "Otro Cliente",
            "email": "otro@foodstore.com",
            "password": "Password123!",
        },
    )
    assert response.status_code == 409

def test_06_auth_me_without_cookie():
    no_auth_client = TestClient(app)
    response = no_auth_client.get("/api/v1/auth/me")
    assert response.status_code == 401

def test_07_auth_me_with_cookie():
    user_client = TestClient(app)
    login_res = user_client.post(
        "/api/v1/auth/token",
        data={"username": "cliente_test", "password": "Password123!"},
    )
    assert login_res.status_code == 200

    response = user_client.get("/api/v1/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "cliente_test"
    assert data["role"] == "user"

def test_08_admin_user_management():
    admin_client = TestClient(app)
    admin_client.post(
        "/api/v1/auth/token",
        data={"username": "admin", "password": "Admin1234!"},
    )

    users_res = admin_client.get("/api/v1/admin/usuarios")
    assert users_res.status_code == 200
    users = users_res.json()
    test_user = next(u for u in users if u["username"] == "cliente_test")
    admin_user = next(u for u in users if u["username"] == "admin")

    self_deact = admin_client.post(f"/api/v1/admin/usuarios/{admin_user['id']}/desactivar")
    assert self_deact.status_code == 400

    deact_res = admin_client.post(f"/api/v1/admin/usuarios/{test_user['id']}/desactivar")
    assert deact_res.status_code == 200
    assert deact_res.json()["disabled"] is True

    user_client = TestClient(app)
    login_disabled = user_client.post(
        "/api/v1/auth/token",
        data={"username": "cliente_test", "password": "Password123!"},
    )
    assert login_disabled.status_code == 400
    assert "desactivada" in login_disabled.json()["detail"]

    react_res = admin_client.post(f"/api/v1/admin/usuarios/{test_user['id']}/activar")
    assert react_res.status_code == 200
    assert react_res.json()["disabled"] is False

def test_09_categorias_crud_and_soft_delete():
    admin_client = TestClient(app)
    admin_client.post(
        "/api/v1/auth/token",
        data={"username": "admin", "password": "Admin1234!"},
    )

    cat_res = admin_client.post(
        "/api/v1/categorias",
        json={"nombre": "Minutas", "descripcion": "Platos rápidos al paso"},
    )
    assert cat_res.status_code == 201
    cat = cat_res.json()
    cat_id = cat["id"]

    dup_res = admin_client.post(
        "/api/v1/categorias",
        json={"nombre": "Minutas", "descripcion": "Otra"},
    )
    assert dup_res.status_code == 409

    upd_res = admin_client.put(
        f"/api/v1/categorias/{cat_id}",
        json={"nombre": "Minutas y Ensaladas", "descripcion": "Actualizada"},
    )
    assert upd_res.status_code == 200
    assert upd_res.json()["nombre"] == "Minutas y Ensaladas"

    del_res = admin_client.delete(f"/api/v1/categorias/{cat_id}")
    assert del_res.status_code == 204

    get_res = admin_client.get(f"/api/v1/categorias/{cat_id}")
    assert get_res.status_code == 404

    dup2_res = admin_client.post(
        "/api/v1/categorias",
        json={"nombre": "Minutas y Ensaladas", "descripcion": "Intento"},
    )
    assert dup2_res.status_code == 409

def test_10_productos_crud():
    admin_client = TestClient(app)
    admin_client.post(
        "/api/v1/auth/token",
        data={"username": "admin", "password": "Admin1234!"},
    )

    cats = admin_client.get("/api/v1/categorias").json()
    cat_id = cats[0]["id"]

    prod_res = admin_client.post(
        "/api/v1/productos",
        json={
            "nombre": "Empanada Criolla",
            "descripcion": "Carne cortada a cuchillo",
            "precio_base": 2.50,
            "imagen_url": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5",
            "stock": 50,
            "disponible": True,
            "categoria_id": cat_id,
        },
    )
    assert prod_res.status_code == 201
    prod = prod_res.json()
    prod_id = prod["id"]
    assert prod["stock"] == 50
    assert prod["categoria"]["id"] == cat_id

    patch_res = admin_client.patch(
        f"/api/v1/productos/{prod_id}/stock",
        json={"stock": 40, "disponible": True},
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["stock"] == 40

    list_res = admin_client.get("/api/v1/productos?search=empanada&limit=5")
    assert list_res.status_code == 200
    p_data = list_res.json()
    assert p_data["total"] >= 1
    assert any(p["id"] == prod_id for p in p_data["items"])

def test_11_pedidos_and_business_rules():
    admin_client = TestClient(app)
    admin_client.post(
        "/api/v1/auth/token",
        data={"username": "admin", "password": "Admin1234!"},
    )

    user_client = TestClient(app)
    user_client.post(
        "/api/v1/auth/token",
        data={"username": "cliente_test", "password": "Password123!"},
    )

    prods = user_client.get("/api/v1/productos?limit=10").json()["items"]
    p1 = prods[0]
    p2 = prods[1]
    initial_stock_p1 = p1["stock"]

    res_rep = user_client.post(
        "/api/v1/pedidos",
        json={
            "items": [
                {"producto_id": p1["id"], "cantidad": 1},
                {"producto_id": p1["id"], "cantidad": 2},
            ],
            "forma_pago": "EFECTIVO",
            "direccion_entrega": "Av. Corrientes 1234, CABA",
        },
    )
    assert res_rep.status_code == 400
    assert "duplicado" in res_rep.json()["detail"].lower()

    res_stock = user_client.post(
        "/api/v1/pedidos",
        json={
            "items": [
                {"producto_id": p1["id"], "cantidad": initial_stock_p1 + 100},
            ],
            "forma_pago": "EFECTIVO",
            "direccion_entrega": "Av. Corrientes 1234, CABA",
        },
    )
    assert res_stock.status_code == 400
    assert "insuficiente" in res_stock.json()["detail"].lower()

    p1_check = user_client.get(f"/api/v1/productos/{p1['id']}").json()
    assert p1_check["stock"] == initial_stock_p1

    cant = 2
    res_crear = user_client.post(
        "/api/v1/pedidos",
        json={
            "items": [
                {"producto_id": p1["id"], "cantidad": cant},
            ],
            "forma_pago": "TRANSFERENCIA",
            "direccion_entrega": "Calle Falsa 123, PB B",
            "notas": "Tocar timbre 2 veces",
        },
    )
    assert res_crear.status_code == 201
    pedido = res_crear.json()
    pedido_id = pedido["id"]
    assert pedido["estado"] == "PENDIENTE"
    assert pedido["total"] == round(p1["precio_base"] * cant, 2)
    assert len(pedido["items"]) == 1
    assert pedido["items"][0]["nombre_producto"] == p1["nombre"]

    p1_after = user_client.get(f"/api/v1/productos/{p1['id']}").json()
    assert p1_after["stock"] == initial_stock_p1 - cant

    otro_client = TestClient(app)
    otro_client.post(
        "/api/v1/auth/register",
        json={
            "username": "otro_cliente",
            "full_name": "Otro Cliente Mas",
            "email": "otro_cliente@foodstore.com",
            "password": "Password123!",
        },
    )
    otro_client.post(
        "/api/v1/auth/token",
        data={"username": "otro_cliente", "password": "Password123!"},
    )
    ajeno_res = otro_client.get(f"/api/v1/pedidos/{pedido_id}")
    assert ajeno_res.status_code == 403

    res_canc = user_client.patch(f"/api/v1/pedidos/{pedido_id}/cancelar")
    assert res_canc.status_code == 200
    assert res_canc.json()["estado"] == "CANCELADO"

    p1_rest = user_client.get(f"/api/v1/productos/{p1['id']}").json()
    assert p1_rest["stock"] == initial_stock_p1

    res_trans_inv = admin_client.patch(
        f"/api/v1/pedidos/{pedido_id}/estado",
        json={"estado": "EN_PREPARACION"},
    )
    assert res_trans_inv.status_code == 400

    res2 = user_client.post(
        "/api/v1/pedidos",
        json={
            "items": [{"producto_id": p2["id"], "cantidad": 1}],
            "forma_pago": "EFECTIVO",
            "direccion_entrega": "San Martin 500",
        },
    )
    p2_id = res2.json()["id"]

    res_prep = admin_client.patch(
        f"/api/v1/pedidos/{p2_id}/estado",
        json={"estado": "EN_PREPARACION"},
    )
    assert res_prep.status_code == 200
    assert res_prep.json()["estado"] == "EN_PREPARACION"

    cant_cancel = user_client.patch(f"/api/v1/pedidos/{p2_id}/cancelar")
    assert cant_cancel.status_code == 400

    res_entr = admin_client.patch(
        f"/api/v1/pedidos/{p2_id}/estado",
        json={"estado": "ENTREGADO"},
    )
    assert res_entr.status_code == 200
    assert res_entr.json()["estado"] == "ENTREGADO"

    resumen_res = admin_client.get("/api/v1/pedidos/resumen")
    assert resumen_res.status_code == 200
    r_data = resumen_res.json()
    assert r_data["entregados"] >= 1
    assert r_data["cancelados"] >= 1
    assert r_data["ingresos_entregados"] >= p2["precio_base"]

if __name__ == "__main__":
    setup_module()
    test_01_root_endpoint()
    test_02_login_admin()
    test_03_login_bad_credentials()
    test_04_register_client()
    test_05_register_duplicate_username_and_email()
    test_06_auth_me_without_cookie()
    test_07_auth_me_with_cookie()
    test_08_admin_user_management()
    test_09_categorias_crud_and_soft_delete()
    test_10_productos_crud()
    test_11_pedidos_and_business_rules()
    print("\n✅ TODAS LAS PRUEBAS DE INTEGRACIÓN DEL BACKEND PASARON EXITOSAMENTE (100% OK)")
