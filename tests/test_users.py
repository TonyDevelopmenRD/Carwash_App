def test_create_user(client):
    # Setup: crear rol
    role_response = client.post("/roles/", json={
        "name": "user_role",
        "description": "Basic role"
    })
    role_id = role_response.json()["id"]

    # Test: crear usuario
    response = client.post("/users/", json={
        "username": "testuser",
        "email": "test@test.com",
        "password": "12345678",
        "role_id": role_id
    })

    assert response.status_code == 200