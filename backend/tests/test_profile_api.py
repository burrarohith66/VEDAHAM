"""Integration tests for the User and Academic Profile API endpoints."""

import os

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-that-is-long-enough-for-development"
os.environ["AUTH_COOKIE_SECURE"] = "false"

from fastapi.testclient import TestClient

from app.core.database import Base, get_engine, get_session_factory
from app.core.security import ACCESS_COOKIE_NAME, create_access_token
from app.main import app
from app.models.student_profile import StudentProfile
from app.models.user import User


def setup_function() -> None:
    Base.metadata.drop_all(bind=get_engine())
    Base.metadata.create_all(bind=get_engine())


def _create_authenticated_client(
    email: str,
    full_name: str = "Test Student",
    college: str = "Vedaham Institute",
    with_student_profile: bool = True,
) -> TestClient:
    session = get_session_factory()()
    try:
        user = User(
            full_name=full_name,
            email=email.lower(),
            password_hash="test-hashed-pw",
            college=college,
            is_active=True,
            is_verified=True,
        )
        session.add(user)
        session.flush()

        if with_student_profile:
            profile = StudentProfile(
                user_id=user.id,
                degree="B.Tech",
                branch="Computer Science and Engineering",
                year_of_study=2,
                graduation_year=2028,
                current_semester=4,
                daily_study_minutes=150,
                onboarding_completed=True,
            )
            session.add(profile)

        session.commit()
        session.refresh(user)
        token = create_access_token(user.id)
    finally:
        session.close()

    client = TestClient(app)
    client.cookies.set(ACCESS_COOKIE_NAME, token)
    return client


def test_unauthorized_endpoints_rejected() -> None:
    with TestClient(app) as client:
        assert client.get("/api/profile").status_code == 401
        assert client.patch("/api/profile/user", json={"full_name": "New Name"}).status_code == 401
        assert client.patch("/api/profile/academic", json={"current_semester": 5}).status_code == 401


def test_get_complete_profile() -> None:
    with _create_authenticated_client("student@example.com", "Asha Rao", "Vedaham College") as client:
        res = client.get("/api/profile")
        assert res.status_code == 200
        data = res.json()

        assert "user" in data
        assert "student_profile" in data
        assert data["user"]["full_name"] == "Asha Rao"
        assert data["user"]["email"] == "student@example.com"
        assert data["user"]["college"] == "Vedaham College"
        assert "password_hash" not in data["user"]
        assert "password_hash" not in str(data)

        assert data["student_profile"]["degree"] == "B.Tech"
        assert data["student_profile"]["branch"] == "Computer Science and Engineering"
        assert data["student_profile"]["year_of_study"] == 2
        assert data["student_profile"]["graduation_year"] == 2028
        assert data["student_profile"]["current_semester"] == 4
        assert data["student_profile"]["daily_study_minutes"] == 150
        assert data["student_profile"]["onboarding_completed"] is True


def test_get_profile_without_student_profile() -> None:
    with _create_authenticated_client(
        "noprofile@example.com", "Solo User", with_student_profile=False
    ) as client:
        res = client.get("/api/profile")
        assert res.status_code == 200
        data = res.json()
        assert data["user"]["full_name"] == "Solo User"
        assert data["student_profile"] is None


def test_update_user_profile() -> None:
    with _create_authenticated_client("update_user@example.com") as client:
        res = client.patch(
            "/api/profile/user",
            json={"full_name": "Updated Name", "college": "Updated College"},
        )
        assert res.status_code == 200
        assert res.json()["full_name"] == "Updated Name"
        assert res.json()["college"] == "Updated College"

        # Verify persistence via GET
        get_res = client.get("/api/profile")
        assert get_res.json()["user"]["full_name"] == "Updated Name"
        assert get_res.json()["user"]["college"] == "Updated College"


def test_partial_user_update() -> None:
    with _create_authenticated_client("partial_user@example.com", "Original Name", "Original College") as client:
        res = client.patch("/api/profile/user", json={"college": "Only College Changed"})
        assert res.status_code == 200
        assert res.json()["full_name"] == "Original Name"
        assert res.json()["college"] == "Only College Changed"


def test_email_cannot_be_modified() -> None:
    with _create_authenticated_client("fixed_email@example.com") as client:
        # Client tries to send an email field to modify account email
        res = client.patch("/api/profile/user", json={"email": "hacked@example.com", "full_name": "Valid Name"})
        assert res.status_code == 200
        assert res.json()["email"] == "fixed_email@example.com"
        assert res.json()["full_name"] == "Valid Name"


def test_invalid_full_name() -> None:
    with _create_authenticated_client("name_validation@example.com") as client:
        assert client.patch("/api/profile/user", json={"full_name": ""}).status_code == 422
        assert client.patch("/api/profile/user", json={"full_name": "   "}).status_code == 422
        assert client.patch("/api/profile/user", json={"full_name": "A"}).status_code == 422
        assert client.patch("/api/profile/user", json={"full_name": "x" * 121}).status_code == 422


def test_academic_update() -> None:
    with _create_authenticated_client("academic_test@example.com") as client:
        res = client.patch(
            "/api/profile/academic",
            json={"current_semester": 5, "daily_study_minutes": 210},
        )
        assert res.status_code == 200
        data = res.json()
        assert data["current_semester"] == 5
        assert data["daily_study_minutes"] == 210
        assert data["degree"] == "B.Tech"  # Unchanged field remains intact


def test_academic_validation() -> None:
    with _create_authenticated_client("academic_val@example.com") as client:
        # Invalid year of study
        assert client.patch("/api/profile/academic", json={"year_of_study": 0}).status_code == 422
        assert client.patch("/api/profile/academic", json={"year_of_study": 5}).status_code == 422

        # Invalid current semester
        assert client.patch("/api/profile/academic", json={"current_semester": 0}).status_code == 422
        assert client.patch("/api/profile/academic", json={"current_semester": 9}).status_code == 422

        # Invalid graduation year
        assert client.patch("/api/profile/academic", json={"graduation_year": 1899}).status_code == 422
        assert client.patch("/api/profile/academic", json={"graduation_year": 2101}).status_code == 422

        # Negative daily study minutes
        assert client.patch("/api/profile/academic", json={"daily_study_minutes": -1}).status_code == 422


def test_text_length_validation() -> None:
    with _create_authenticated_client("text_length@example.com") as client:
        assert client.patch("/api/profile/academic", json={"degree": "d" * 121}).status_code == 422
        assert client.patch("/api/profile/academic", json={"branch": "b" * 151}).status_code == 422
        assert client.patch("/api/profile/user", json={"college": "c" * 256}).status_code == 422


def test_academic_patch_on_user_without_profile_returns_404() -> None:
    with _create_authenticated_client(
        "no_profile_patch@example.com", with_student_profile=False
    ) as client:
        res = client.patch("/api/profile/academic", json={"current_semester": 5})
        assert res.status_code == 404
        assert res.json()["detail"] == "Student profile not found"


def test_cross_user_isolation() -> None:
    with (
        _create_authenticated_client("user_a@example.com", "User A") as client_a,
        _create_authenticated_client("user_b@example.com", "User B") as client_b,
    ):
        # User B reads profile -> receives User B's profile only
        profile_b = client_b.get("/api/profile").json()
        assert profile_b["user"]["email"] == "user_b@example.com"
        assert profile_b["user"]["full_name"] == "User B"

        # User B updates profile
        client_b.patch("/api/profile/user", json={"full_name": "User B Modified"})
        client_b.patch("/api/profile/academic", json={"current_semester": 7})

        # User A's profile must remain completely untouched
        profile_a = client_a.get("/api/profile").json()
        assert profile_a["user"]["email"] == "user_a@example.com"
        assert profile_a["user"]["full_name"] == "User A"
        assert profile_a["student_profile"]["current_semester"] == 4


def _create_user_with_password(
    email: str,
    raw_password: str = "CorrectHorseBattery99!",
    full_name: str = "Test Student",
) -> tuple[TestClient, User]:
    from app.core.security import hash_password

    session = get_session_factory()()
    try:
        user = User(
            full_name=full_name,
            email=email.lower(),
            password_hash=hash_password(raw_password),
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
    return client, user


def test_change_password_unauthenticated_rejected() -> None:
    with TestClient(app) as client:
        res = client.post(
            "/api/profile/change-password",
            json={
                "current_password": "OldPassword123!",
                "new_password": "NewSecurePassword456!",
                "confirm_new_password": "NewSecurePassword456!",
            },
        )
        assert res.status_code == 401


def test_change_password_success() -> None:
    client, user = _create_user_with_password(
        "pwd_success@example.com", "CurrentSecret123!"
    )
    with client:
        res = client.post(
            "/api/profile/change-password",
            json={
                "current_password": "CurrentSecret123!",
                "new_password": "BrandNewSecret456!",
                "confirm_new_password": "BrandNewSecret456!",
            },
        )
        assert res.status_code == 200
        data = res.json()
        assert data["message"] == "Password changed successfully."

        # Verify new session cookie is issued in response
        assert ACCESS_COOKIE_NAME in res.cookies

        # Verify active session continues to function
        me_res = client.get("/api/auth/me")
        assert me_res.status_code == 200
        assert me_res.json()["email"] == "pwd_success@example.com"


def test_change_password_enables_new_password_login_and_invalidates_old() -> None:
    client, user = _create_user_with_password(
        "pwd_login@example.com", "InitialPassword123!"
    )
    with client:
        res = client.post(
            "/api/profile/change-password",
            json={
                "current_password": "InitialPassword123!",
                "new_password": "UpdatedPassword456!",
                "confirm_new_password": "UpdatedPassword456!",
            },
        )
        assert res.status_code == 200

    # New unauthenticated client attempts login
    with TestClient(app) as guest_client:
        # Old password must now fail
        old_login = guest_client.post(
            "/api/auth/login",
            json={
                "email": "pwd_login@example.com",
                "password": "InitialPassword123!",
            },
        )
        assert old_login.status_code == 401

        # New password must succeed
        new_login = guest_client.post(
            "/api/auth/login",
            json={
                "email": "pwd_login@example.com",
                "password": "UpdatedPassword456!",
            },
        )
        assert new_login.status_code == 200
        assert new_login.json()["user"]["email"] == "pwd_login@example.com"


def test_change_password_incorrect_current_password_rejected() -> None:
    client, user = _create_user_with_password(
        "pwd_wrong@example.com", "RightCurrentPass123!"
    )
    with client:
        res = client.post(
            "/api/profile/change-password",
            json={
                "current_password": "WrongCurrentPass999!",
                "new_password": "BrandNewPassword456!",
                "confirm_new_password": "BrandNewPassword456!",
            },
        )
        assert res.status_code == 401
        assert res.json()["detail"] == "Current password is incorrect."


def test_change_password_mismatched_confirmation_rejected() -> None:
    client, _ = _create_user_with_password(
        "pwd_mismatch@example.com", "ValidPass123!"
    )
    with client:
        res = client.post(
            "/api/profile/change-password",
            json={
                "current_password": "ValidPass123!",
                "new_password": "BrandNewSecret123!",
                "confirm_new_password": "TotallyDifferentPass!",
            },
        )
        assert res.status_code == 422


def test_change_password_same_as_current_rejected() -> None:
    client, _ = _create_user_with_password("pwd_same@example.com", "ExistingPass123!")
    with client:
        res = client.post(
            "/api/profile/change-password",
            json={
                "current_password": "ExistingPass123!",
                "new_password": "ExistingPass123!",
                "confirm_new_password": "ExistingPass123!",
            },
        )
        assert res.status_code == 422


def test_change_password_length_validation() -> None:
    client, _ = _create_user_with_password("pwd_len@example.com", "ValidPass123!")
    with client:
        # Too short (< 8 chars)
        short_res = client.post(
            "/api/profile/change-password",
            json={
                "current_password": "ValidPass123!",
                "new_password": "short",
                "confirm_new_password": "short",
            },
        )
        assert short_res.status_code == 422

        # Too long (> 128 chars)
        long_pass = "A" * 129
        long_res = client.post(
            "/api/profile/change-password",
            json={
                "current_password": "ValidPass123!",
                "new_password": long_pass,
                "confirm_new_password": long_pass,
            },
        )
        assert long_res.status_code == 422


def test_change_password_isolation_between_users() -> None:
    client_a, user_a = _create_user_with_password(
        "user_a_pwd@example.com", "UserAPassword123!"
    )
    client_b, user_b = _create_user_with_password(
        "user_b_pwd@example.com", "UserBPassword123!"
    )

    with client_a:
        res_a = client_a.post(
            "/api/profile/change-password",
            json={
                "current_password": "UserAPassword123!",
                "new_password": "NewUserAPassword456!",
                "confirm_new_password": "NewUserAPassword456!",
            },
        )
        assert res_a.status_code == 200

    # User B's password must remain completely unchanged
    with TestClient(app) as guest:
        login_b = guest.post(
            "/api/auth/login",
            json={
                "email": "user_b_pwd@example.com",
                "password": "UserBPassword123!",
            },
        )
        assert login_b.status_code == 200

