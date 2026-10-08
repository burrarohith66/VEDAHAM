"""Integration tests for the Student Onboarding API endpoints."""

import os

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-that-is-long-enough-for-development"
os.environ["AUTH_COOKIE_SECURE"] = "false"

from fastapi.testclient import TestClient

from app.core.database import Base, get_engine, get_session_factory
from app.core.security import ACCESS_COOKIE_NAME, create_access_token
from app.main import app
from app.models.user import User


def setup_function() -> None:
    Base.metadata.drop_all(bind=get_engine())
    Base.metadata.create_all(bind=get_engine())


def _create_authenticated_client(email: str, full_name: str = "Test Student") -> TestClient:
    session = get_session_factory()()
    try:
        user = User(
            full_name=full_name,
            email=email.lower(),
            password_hash="test-hashed-pw",
            college="Vedaham Institute",
            is_active=True,
            is_verified=True,
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        token = create_access_token(user.id)
    finally:
        session.close()

    client = TestClient(app)
    client.cookies.set(ACCESS_COOKIE_NAME, token)
    return client


def test_unauthenticated_requests_are_rejected() -> None:
    with TestClient(app) as client:
        assert client.get("/api/onboarding/status").status_code == 401
        assert client.get("/api/onboarding").status_code == 401
        assert client.post("/api/onboarding", json={"degree": "B.Tech"}).status_code == 401
        assert client.patch("/api/onboarding", json={"daily_study_minutes": 60}).status_code == 401
        assert client.post("/api/onboarding/complete").status_code == 401


def test_authenticated_status_no_profile() -> None:
    with _create_authenticated_client("student1@example.com") as client:
        status_res = client.get("/api/onboarding/status")
        assert status_res.status_code == 200
        assert status_res.json() == {"completed": False, "profile_exists": False}

        get_res = client.get("/api/onboarding")
        assert get_res.status_code == 404
        assert get_res.json()["detail"] == "Student profile not found"


def test_profile_creation_and_lifecycle() -> None:
    with _create_authenticated_client("asha.rao@example.com", "Asha Rao") as client:
        # 1. Create Profile
        create_payload = {
            "degree": "B.Tech",
            "branch": "Computer Science and Engineering",
            "year_of_study": 2,
            "graduation_year": 2028,
            "current_semester": 3,
            "daily_study_minutes": 120,
        }
        create_res = client.post("/api/onboarding", json=create_payload)
        assert create_res.status_code == 201
        created_data = create_res.json()
        assert created_data["degree"] == "B.Tech"
        assert created_data["branch"] == "Computer Science and Engineering"
        assert created_data["year_of_study"] == 2
        assert created_data["graduation_year"] == 2028
        assert created_data["current_semester"] == 3
        assert created_data["daily_study_minutes"] == 120
        assert created_data["onboarding_completed"] is False
        assert "id" in created_data
        assert "user_id" in created_data

        # 2. Status shows profile_exists=True, completed=False
        status_res = client.get("/api/onboarding/status")
        assert status_res.status_code == 200
        assert status_res.json() == {"completed": False, "profile_exists": True}

        # 3. GET /api/onboarding returns created profile
        get_res = client.get("/api/onboarding")
        assert get_res.status_code == 200
        assert get_res.json()["id"] == created_data["id"]
        assert get_res.json()["degree"] == "B.Tech"

        # 4. Duplicate creation returns 409 Conflict
        duplicate_res = client.post("/api/onboarding", json=create_payload)
        assert duplicate_res.status_code == 409
        assert duplicate_res.json()["detail"] == "Student profile already exists"

        # 5. PATCH /api/onboarding partial update
        patch_res = client.patch("/api/onboarding", json={"daily_study_minutes": 90})
        assert patch_res.status_code == 200
        assert patch_res.json()["daily_study_minutes"] == 90
        assert patch_res.json()["degree"] == "B.Tech"

        # 6. Complete onboarding
        complete_res = client.post("/api/onboarding/complete")
        assert complete_res.status_code == 200
        assert complete_res.json()["onboarding_completed"] is True

        # 7. Status now shows completed=True
        status_after = client.get("/api/onboarding/status")
        assert status_after.status_code == 200
        assert status_after.json() == {"completed": True, "profile_exists": True}


def test_invalid_values_rejected() -> None:
    with _create_authenticated_client("valid@example.com") as client:
        # Invalid year_of_study = 5 (> 4)
        res_year = client.post("/api/onboarding", json={"year_of_study": 5})
        assert res_year.status_code == 422

        # Invalid current_semester = 9 (> 8)
        res_sem = client.post("/api/onboarding", json={"current_semester": 9})
        assert res_sem.status_code == 422

        # Negative daily_study_minutes
        res_mins = client.post("/api/onboarding", json={"daily_study_minutes": -1})
        assert res_mins.status_code == 422

        # Invalid graduation_year
        res_grad = client.post("/api/onboarding", json={"graduation_year": 1800})
        assert res_grad.status_code == 422


def test_user_data_isolation() -> None:
    """Security test: User A cannot see or mutate User B's profile."""
    with (
        _create_authenticated_client("userb@example.com", "User B") as client_b,
        _create_authenticated_client("usera@example.com", "User A") as client_a,
    ):
        # Create profile for User B
        res_b = client_b.post(
            "/api/onboarding",
            json={
                "degree": "B.Sc",
                "branch": "Physics",
                "year_of_study": 1,
                "current_semester": 1,
            },
        )
        assert res_b.status_code == 201
        profile_b_id = res_b.json()["id"]

        # User A checks status (has no profile)
        status_a = client_a.get("/api/onboarding/status")
        assert status_a.status_code == 200
        assert status_a.json() == {"completed": False, "profile_exists": False}

        # User A cannot retrieve User B's profile
        get_a = client_a.get("/api/onboarding")
        assert get_a.status_code == 404
        assert get_a.json()["detail"] == "Student profile not found"

        # User A cannot complete User B's profile
        complete_a = client_a.post("/api/onboarding/complete")
        assert complete_a.status_code == 404

        # User A cannot patch User B's profile
        patch_a = client_a.patch("/api/onboarding", json={"daily_study_minutes": 100})
        assert patch_a.status_code == 404

        # Verify User B's profile is still intact and not modified
        profile_b = client_b.get("/api/onboarding").json()
        assert profile_b["id"] == profile_b_id
        assert profile_b["branch"] == "Physics"
        assert profile_b["daily_study_minutes"] is None
        assert profile_b["onboarding_completed"] is False
