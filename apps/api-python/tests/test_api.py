from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app


def make_client() -> TestClient:
    settings = Settings(database_url="sqlite:///:memory:")
    return TestClient(create_app(settings))


def test_health_and_admin_jwt_flow() -> None:
    with make_client() as client:
        health = client.get("/health")
        assert health.status_code == 200
        assert health.json()["service"] == "api-python"

        login = client.post(
            "/auth/login",
            json={"email": "admin@example.com", "password": "Admin123!"},
        )
        assert login.status_code == 200
        token = login.json()["accessToken"]
        headers = {"Authorization": f"Bearer {token}"}

        me = client.get("/auth/me", headers=headers)
        assert me.status_code == 200
        assert me.json()["role"] == "admin"

        stats = client.get("/admin/stats", headers=headers)
        assert stats.status_code == 200
        assert stats.json()["totalUsers"] >= 1

        users = client.get("/admin/users", headers=headers)
        assert users.status_code == 200
        assert len(users.json()) >= 1


def test_register_and_role_guard() -> None:
    with make_client() as client:
        registered = client.post(
            "/auth/register",
            json={"email": "user@example.com", "password": "Password123!", "name": "Regular User"},
        )
        assert registered.status_code == 201
        token = registered.json()["accessToken"]

        forbidden = client.get("/admin/users", headers={"Authorization": f"Bearer {token}"})
        assert forbidden.status_code == 403
