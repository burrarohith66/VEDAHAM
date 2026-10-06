"""Authentication integration tests using a temporary SQLite database."""

import os

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-that-is-long-enough-for-development"
os.environ["AUTH_COOKIE_SECURE"] = "false"

from fastapi.testclient import TestClient

from app.core.database import Base, get_engine
from app.main import app
from app.models.user import User


def setup_function() -> None:
    Base.metadata.drop_all(bind=get_engine())
    Base.metadata.create_all(bind=get_engine())


def test_register_me_logout_and_duplicate_email() -> None:
    with TestClient(app) as client:
        registration = client.post(
            "/api/auth/register",
            json={
                "full_name": "Asha Rao",
                "email": "asha@example.com",
                "password": "safe-password-123",
                "confirm_password": "safe-password-123",
                "college": "Vedaham University",
            },
        )
        assert registration.status_code == 201
        assert registration.json()["token_type"] == "cookie"
        assert "password_hash" not in registration.text
        assert client.cookies.get("vedaham_access_token")

        me = client.get("/api/auth/me")
        assert me.status_code == 200
        assert me.json()["email"] == "asha@example.com"

        duplicate = client.post(
            "/api/auth/register",
            json={
                "full_name": "Another Asha",
                "email": "asha@example.com",
                "password": "safe-password-123",
                "confirm_password": "safe-password-123",
            },
        )
        assert duplicate.status_code == 409

        logout = client.post("/api/auth/logout")
        assert logout.status_code == 200
        assert client.get("/api/auth/me").status_code == 401


def test_login_rejects_invalid_credentials() -> None:
    with TestClient(app) as client:
        response = client.post("/api/auth/login", json={"email": "nobody@example.com", "password": "wrong-password"})
        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid email or password."


def test_login_accepts_registered_credentials() -> None:
    with TestClient(app) as client:
        client.post(
            "/api/auth/register",
            json={
                "full_name": "Ravi Kumar",
                "email": "ravi@example.com",
                "password": "safe-password-123",
                "confirm_password": "safe-password-123",
            },
        )
        client.post("/api/auth/logout")
        login = client.post("/api/auth/login", json={"email": "ravi@example.com", "password": "safe-password-123"})
        assert login.status_code == 200
        assert login.json()["user"]["email"] == "ravi@example.com"
        assert client.cookies.get("vedaham_access_token")
