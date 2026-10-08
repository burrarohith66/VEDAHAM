"""Tests for student onboarding schemas and StudentProfile model."""

from datetime import datetime, timezone
from uuid import uuid4

import pytest
from pydantic import ValidationError

from app.models.student_profile import StudentProfile
from app.models.user import User
from app.schemas.onboarding import (
    StudentProfileCreate,
    StudentProfileRead,
    StudentProfileUpdate,
)


def test_valid_student_profile_create() -> None:
    data = {
        "degree": "B.Tech",
        "branch": "Computer Science and Engineering",
        "year_of_study": 2,
        "graduation_year": 2028,
        "current_semester": 3,
        "daily_study_minutes": 120,
    }
    profile = StudentProfileCreate(**data)
    assert profile.degree == "B.Tech"
    assert profile.branch == "Computer Science and Engineering"
    assert profile.year_of_study == 2
    assert profile.graduation_year == 2028
    assert profile.current_semester == 3
    assert profile.daily_study_minutes == 120


def test_empty_student_profile_create() -> None:
    profile = StudentProfileCreate()
    assert profile.degree is None
    assert profile.branch is None
    assert profile.year_of_study is None
    assert profile.graduation_year is None
    assert profile.current_semester is None
    assert profile.daily_study_minutes is None


@pytest.mark.parametrize("invalid_year", [0, 5])
def test_invalid_year_of_study(invalid_year: int) -> None:
    with pytest.raises(ValidationError):
        StudentProfileCreate(year_of_study=invalid_year)


@pytest.mark.parametrize("invalid_sem", [0, 9])
def test_invalid_current_semester(invalid_sem: int) -> None:
    with pytest.raises(ValidationError):
        StudentProfileCreate(current_semester=invalid_sem)


def test_negative_daily_study_minutes() -> None:
    with pytest.raises(ValidationError):
        StudentProfileCreate(daily_study_minutes=-1)


@pytest.mark.parametrize("invalid_grad_year", [1899, 2101])
def test_invalid_graduation_year(invalid_grad_year: int) -> None:
    with pytest.raises(ValidationError):
        StudentProfileCreate(graduation_year=invalid_grad_year)


def test_partial_student_profile_update() -> None:
    update = StudentProfileUpdate(daily_study_minutes=90)
    assert update.daily_study_minutes == 90
    assert update.degree is None
    assert update.year_of_study is None


def test_student_profile_read() -> None:
    user_id = uuid4()
    profile_id = uuid4()
    now = datetime.now(timezone.utc)

    read_data = {
        "id": profile_id,
        "user_id": user_id,
        "degree": "B.Tech",
        "branch": "ECE",
        "year_of_study": 3,
        "graduation_year": 2027,
        "current_semester": 5,
        "daily_study_minutes": 180,
        "onboarding_completed": False,
        "created_at": now,
        "updated_at": now,
    }
    profile_read = StudentProfileRead(**read_data)
    assert profile_read.id == profile_id
    assert profile_read.user_id == user_id
    assert profile_read.onboarding_completed is False


def test_student_profile_model_instantiation() -> None:
    profile = StudentProfile(
        degree="B.Tech",
        branch="CSE",
        year_of_study=1,
        current_semester=2,
    )
    assert profile.degree == "B.Tech"
    assert profile.branch == "CSE"
    assert profile.year_of_study == 1
    assert profile.current_semester == 2


def test_student_profile_and_user_relationship_attributes() -> None:
    assert hasattr(User, "student_profile")
    assert hasattr(StudentProfile, "user")
