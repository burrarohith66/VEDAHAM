"""End-to-End integration tests for Settings, Authentication, and Data Persistence."""

import os

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-that-is-long-enough-for-development"
os.environ["AUTH_COOKIE_SECURE"] = "false"

import pytest
from fastapi.testclient import TestClient

from app.core.database import Base, get_engine, get_session_factory
from app.core.security import ACCESS_COOKIE_NAME, create_access_token, hash_password
from app.main import app
from app.models.student_profile import StudentProfile
from app.models.user import User


def setup_function() -> None:
    Base.metadata.drop_all(bind=get_engine())
    Base.metadata.create_all(bind=get_engine())


def _create_authenticated_client(
    email: str = "student.e2e@vedaham.org",
    password: str = "OriginalPassword123!",
    full_name: str = "Rohith Burra",
    college: str = "Vedaham Engineering College",
    with_student_profile: bool = True,
    degree: str = "B.Tech",
    branch: str = "Computer Science and Engineering",
    year_of_study: int = 2,
    graduation_year: int = 2028,
    current_semester: int = 3,
    daily_study_minutes: int = 90,
) -> TestClient:
    """Helper to create an authenticated test client in the isolated test DB."""
    session = get_session_factory()()
    try:
        user = User(
            full_name=full_name,
            email=email.lower(),
            password_hash=hash_password(password),
            college=college,
            is_active=True,
            is_verified=True,
        )
        session.add(user)
        session.flush()

        if with_student_profile:
            profile = StudentProfile(
                user_id=user.id,
                degree=degree,
                branch=branch,
                year_of_study=year_of_study,
                graduation_year=graduation_year,
                current_semester=current_semester,
                daily_study_minutes=daily_study_minutes,
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


# =========================================================================
# 1. AUTHENTICATION & ROUTE ISOLATION
# =========================================================================

def test_unauthenticated_requests_rejected() -> None:
    """Verify all Settings APIs strictly reject unauthenticated access."""
    with TestClient(app) as client:
        assert client.get("/api/profile").status_code == 401
        assert client.patch("/api/profile/user", json={"full_name": "Test"}).status_code == 401
        assert client.patch("/api/profile/academic", json={"daily_study_minutes": 60}).status_code == 401
        assert (
            client.post(
                "/api/profile/change-password",
                json={
                    "current_password": "OldPassword1!",
                    "new_password": "NewPassword2@",
                    "confirm_new_password": "NewPassword2@",
                },
            ).status_code
            == 401
        )


def test_user_session_isolation() -> None:
    """Verify Profile APIs operate solely on authenticated identity and isolate users."""
    with _create_authenticated_client(email="user1@example.com", full_name="User One") as client1:
        with _create_authenticated_client(email="user2@example.com", full_name="User Two") as client2:
            # Client 1 updates their profile
            res1 = client1.patch("/api/profile/user", json={"full_name": "Updated User One"})
            assert res1.status_code == 200
            assert res1.json()["full_name"] == "Updated User One"

            # Client 2 profile remains untouched
            res2 = client2.get("/api/profile")
            assert res2.status_code == 200
            assert res2.json()["user"]["full_name"] == "User Two"


# =========================================================================
# 2. PROFILE SECTION E2E
# =========================================================================

def test_profile_update_and_persistence() -> None:
    """Verify Profile section updates full_name and college, persists across requests, and locks email."""
    with _create_authenticated_client(
        email="rohit@example.com", full_name="Rohit Original", college="Original College"
    ) as client:
        # 1. Read existing profile
        read_res = client.get("/api/profile")
        assert read_res.status_code == 200
        assert read_res.json()["user"]["full_name"] == "Rohit Original"
        assert read_res.json()["user"]["college"] == "Original College"
        assert read_res.json()["user"]["email"] == "rohit@example.com"

        # 2. Update full name and college
        patch_res = client.patch(
            "/api/profile/user",
            json={"full_name": "Rohit Burra", "college": "IIT Madras"},
        )
        assert patch_res.status_code == 200
        assert patch_res.json()["full_name"] == "Rohit Burra"
        assert patch_res.json()["college"] == "IIT Madras"

        # 3. Persistence verification: re-fetch profile
        verify_res = client.get("/api/profile")
        assert verify_res.status_code == 200
        assert verify_res.json()["user"]["full_name"] == "Rohit Burra"
        assert verify_res.json()["user"]["college"] == "IIT Madras"

        # 4. Partial update: update only full_name, college preserved
        partial_res = client.patch("/api/profile/user", json={"full_name": "Rohith B."})
        assert partial_res.status_code == 200
        assert partial_res.json()["full_name"] == "Rohith B."
        assert partial_res.json()["college"] == "IIT Madras"

        # 5. Clear optional college (set to null)
        clear_res = client.patch("/api/profile/user", json={"college": None})
        assert clear_res.status_code == 200
        assert clear_res.json()["college"] is None

        # 6. Verify email cannot be changed
        email_tamper = client.patch("/api/profile/user", json={"email": "hacked@example.com"})
        assert email_tamper.status_code == 200
        assert email_tamper.json()["email"] == "rohit@example.com"


def test_profile_validation_boundaries() -> None:
    """Verify validation boundaries on profile fields."""
    with _create_authenticated_client(email="val@example.com") as client:
        # Full name < 2 chars rejected
        assert client.patch("/api/profile/user", json={"full_name": "A"}).status_code == 422
        assert client.patch("/api/profile/user", json={"full_name": "   "}).status_code == 422

        # Full name > 120 chars rejected
        assert client.patch("/api/profile/user", json={"full_name": "x" * 121}).status_code == 422

        # College > 255 chars rejected
        assert client.patch("/api/profile/user", json={"college": "x" * 256}).status_code == 422


# =========================================================================
# 3. ACADEMIC INFORMATION SECTION E2E
# =========================================================================

def test_academic_information_update_and_persistence() -> None:
    """Verify Academic Information updates, persists, and does NOT overwrite daily_study_minutes."""
    with _create_authenticated_client(email="academic@example.com", daily_study_minutes=90) as client:
        # Initial study minutes was 90
        init_res = client.get("/api/profile")
        assert init_res.json()["student_profile"]["daily_study_minutes"] == 90

        # Update academic curriculum details
        update_res = client.patch(
            "/api/profile/academic",
            json={
                "degree": "B.E.",
                "branch": "Electronics & Communication",
                "year_of_study": 3,
                "current_semester": 5,
                "graduation_year": 2027,
            },
        )
        assert update_res.status_code == 200
        data = update_res.json()
        assert data["degree"] == "B.E."
        assert data["branch"] == "Electronics & Communication"
        assert data["year_of_study"] == 3
        assert data["current_semester"] == 5
        assert data["graduation_year"] == 2027
        # CRITICAL DATA INTEGRITY: daily_study_minutes must remain 90!
        assert data["daily_study_minutes"] == 90

        # Persistence check
        verify_res = client.get("/api/profile")
        assert verify_res.json()["student_profile"]["degree"] == "B.E."
        assert verify_res.json()["student_profile"]["daily_study_minutes"] == 90

        # Clear optional fields to null
        clear_res = client.patch(
            "/api/profile/academic",
            json={"degree": None, "branch": None},
        )
        assert clear_res.status_code == 200
        assert clear_res.json()["degree"] is None
        assert clear_res.json()["branch"] is None
        assert clear_res.json()["year_of_study"] == 3


def test_academic_validation_boundaries() -> None:
    """Verify boundaries for year of study (1-4), semester (1-8), and graduation year (1900-2100)."""
    with _create_authenticated_client(email="acadval@example.com") as client:
        # Invalid year of study
        assert client.patch("/api/profile/academic", json={"year_of_study": 0}).status_code == 422
        assert client.patch("/api/profile/academic", json={"year_of_study": 5}).status_code == 422

        # Invalid semester
        assert client.patch("/api/profile/academic", json={"current_semester": 0}).status_code == 422
        assert client.patch("/api/profile/academic", json={"current_semester": 9}).status_code == 422

        # Invalid graduation year
        assert client.patch("/api/profile/academic", json={"graduation_year": 1899}).status_code == 422
        assert client.patch("/api/profile/academic", json={"graduation_year": 2101}).status_code == 422

        # Valid boundaries
        assert client.patch("/api/profile/academic", json={"year_of_study": 1}).status_code == 200
        assert client.patch("/api/profile/academic", json={"year_of_study": 4}).status_code == 200
        assert client.patch("/api/profile/academic", json={"current_semester": 1}).status_code == 200
        assert client.patch("/api/profile/academic", json={"current_semester": 8}).status_code == 200
        assert client.patch("/api/profile/academic", json={"graduation_year": 1900}).status_code == 200
        assert client.patch("/api/profile/academic", json={"graduation_year": 2100}).status_code == 200


# =========================================================================
# 4. STUDY PREFERENCES SECTION E2E
# =========================================================================

def test_study_preferences_update_presets_and_custom() -> None:
    """Verify Study Preferences presets, custom minutes, and clearing do NOT alter academic fields."""
    with _create_authenticated_client(
        email="prefs@example.com",
        degree="B.Tech",
        branch="Computer Science",
        year_of_study=2,
    ) as client:
        # 1. Update with preset: 120 minutes
        res120 = client.patch("/api/profile/academic", json={"daily_study_minutes": 120})
        assert res120.status_code == 200
        assert res120.json()["daily_study_minutes"] == 120
        # CRITICAL: Degree, branch, year must NOT be overwritten!
        assert res120.json()["degree"] == "B.Tech"
        assert res120.json()["branch"] == "Computer Science"
        assert res120.json()["year_of_study"] == 2

        # 2. Update with custom value: 75 minutes
        res75 = client.patch("/api/profile/academic", json={"daily_study_minutes": 75})
        assert res75.status_code == 200
        assert res75.json()["daily_study_minutes"] == 75
        assert res75.json()["degree"] == "B.Tech"

        # 3. Clear study target (null)
        res_null = client.patch("/api/profile/academic", json={"daily_study_minutes": None})
        assert res_null.status_code == 200
        assert res_null.json()["daily_study_minutes"] is None
        assert res_null.json()["degree"] == "B.Tech"

        # 4. Persistence check after refresh
        verify_res = client.get("/api/profile")
        assert verify_res.json()["student_profile"]["daily_study_minutes"] is None
        assert verify_res.json()["student_profile"]["degree"] == "B.Tech"

        # 5. Invalid negative study minutes rejected
        assert client.patch("/api/profile/academic", json={"daily_study_minutes": -10}).status_code == 422


# =========================================================================
# 5. SECURITY & PASSWORD CHANGE E2E
# =========================================================================

def test_password_change_lifecycle_and_session_refresh() -> None:
    """Verify password change using exact backend fields: current_password, new_password, confirm_new_password."""
    with _create_authenticated_client(
        email="security@example.com",
        password="OriginalPassword123!",
    ) as client:
        # 1. Invalid: incorrect current password
        bad_cur = client.post(
            "/api/profile/change-password",
            json={
                "current_password": "WrongPassword999!",
                "new_password": "NewSecretPassword123!",
                "confirm_new_password": "NewSecretPassword123!",
            },
        )
        assert bad_cur.status_code == 401
        assert "Current password is incorrect" in bad_cur.json()["detail"]

        # 2. Invalid: confirmation mismatch
        mismatch = client.post(
            "/api/profile/change-password",
            json={
                "current_password": "OriginalPassword123!",
                "new_password": "NewSecretPassword123!",
                "confirm_new_password": "DifferentPassword123!",
            },
        )
        assert mismatch.status_code == 422

        # 3. Invalid: new password identical to current password
        same_pw = client.post(
            "/api/profile/change-password",
            json={
                "current_password": "OriginalPassword123!",
                "new_password": "OriginalPassword123!",
                "confirm_new_password": "OriginalPassword123!",
            },
        )
        assert same_pw.status_code == 422

        # 4. Invalid: new password shorter than 8 chars
        short_pw = client.post(
            "/api/profile/change-password",
            json={
                "current_password": "OriginalPassword123!",
                "new_password": "short",
                "confirm_new_password": "short",
            },
        )
        assert short_pw.status_code == 422

        # 5. Valid password change
        success_res = client.post(
            "/api/profile/change-password",
            json={
                "current_password": "OriginalPassword123!",
                "new_password": "NewSecretPassword123!",
                "confirm_new_password": "NewSecretPassword123!",
            },
        )
        assert success_res.status_code == 200
        data = success_res.json()
        assert data["message"] == "Password changed successfully."
        # Verify no token or hash is leaked in response body
        assert "token" not in str(data)
        assert data == {"message": "Password changed successfully."}

        # Verify refreshed session cookie is returned
        assert ACCESS_COOKIE_NAME in success_res.cookies

        # 6. Current session continues to work seamlessly with refreshed cookie
        profile_res = client.get("/api/profile")
        assert profile_res.status_code == 200
        assert profile_res.json()["user"]["email"] == "security@example.com"

        # 7. Old password fails authentication on new login attempt
        with TestClient(app) as login_client:
            old_login = login_client.post(
                "/api/auth/login",
                json={
                    "email": "security@example.com",
                    "password": "OriginalPassword123!",
                },
            )
            assert old_login.status_code == 401

            # 8. New password succeeds authentication
            new_login = login_client.post(
                "/api/auth/login",
                json={
                    "email": "security@example.com",
                    "password": "NewSecretPassword123!",
                },
            )
            assert new_login.status_code == 200
            assert ACCESS_COOKIE_NAME in new_login.cookies


# =========================================================================
# 6. SEQUENTIAL FULL WORKFLOW PERSISTENCE & CROSS-SECTION INTEGRITY
# =========================================================================

def test_full_settings_sequential_journey_and_data_integrity() -> None:
    """
    Test complete sequence of user actions in Settings:
    1. Update Profile (name, college)
    2. Update Academic Information (degree, branch, year, semester, graduation_year)
    3. Update Study Preferences (daily_study_minutes)
    4. Change Password
    5. Re-authenticate / re-fetch profile and assert ZERO accidental overwrites
    """
    with _create_authenticated_client(
        email="e2e.journey@vedaham.org",
        password="InitialPass1234!",
        full_name="Alice Smith",
        college="Initial Tech",
        degree="B.Tech",
        branch="Electrical",
        year_of_study=1,
        current_semester=1,
        graduation_year=2028,
        daily_study_minutes=60,
    ) as client:
        # Step 1: Update Profile
        p_res = client.patch(
            "/api/profile/user",
            json={"full_name": "Dr. Alice Smith", "college": "National Institute of Tech"},
        )
        assert p_res.status_code == 200

        # Step 2: Update Academic Information
        a_res = client.patch(
            "/api/profile/academic",
            json={
                "degree": "B.Tech Honors",
                "branch": "Artificial Intelligence & Data Science",
                "year_of_study": 3,
                "current_semester": 6,
                "graduation_year": 2026,
            },
        )
        assert a_res.status_code == 200

        # Step 3: Update Study Preferences
        pref_res = client.patch(
            "/api/profile/academic",
            json={"daily_study_minutes": 180},
        )
        assert pref_res.status_code == 200

        # Step 4: Change Password
        pw_res = client.post(
            "/api/profile/change-password",
            json={
                "current_password": "InitialPass1234!",
                "new_password": "SuperSecurePass999!",
                "confirm_new_password": "SuperSecurePass999!",
            },
        )
        assert pw_res.status_code == 200

        # Step 5: Verify all updated fields remain intact
        final_res = client.get("/api/profile")
        assert final_res.status_code == 200
        combined = final_res.json()

        # User Profile asserts
        assert combined["user"]["full_name"] == "Dr. Alice Smith"
        assert combined["user"]["college"] == "National Institute of Tech"
        assert combined["user"]["email"] == "e2e.journey@vedaham.org"

        # Academic Information asserts
        student_prof = combined["student_profile"]
        assert student_prof["degree"] == "B.Tech Honors"
        assert student_prof["branch"] == "Artificial Intelligence & Data Science"
        assert student_prof["year_of_study"] == 3
        assert student_prof["current_semester"] == 6
        assert student_prof["graduation_year"] == 2026

        # Study Preferences asserts
        assert student_prof["daily_study_minutes"] == 180
        assert student_prof["onboarding_completed"] is True
