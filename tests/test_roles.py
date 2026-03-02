def test_create_role(client):
    response = client.post("/roles/", json={
        "name": "admin",
        "description": "Administrator"
    })

    assert response.status_code == 200
    data = response.json()

    assert data["name"] == "admin"
    assert data["description"] == "Administrator"


def test_get_roles(client):
    client.post("/roles/", json={
        "name": "manager",
        "description": "Manager role"
    })

    response = client.get("/roles/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_role_not_found(client):
    response = client.get("/roles/999")
    assert response.status_code == 404