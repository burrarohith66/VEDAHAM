"""Student onboarding business logic and database persistence."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.student_profile import StudentProfile
from app.models.user import User
from app.schemas.onboarding import (
    OnboardingStatusResponse,
    StudentProfileCreate,
    StudentProfileUpdate,
)


class ProfileAlreadyExistsError(Exception):
    """Raised when a profile is created for a user that already has one."""


class ProfileNotFoundError(Exception):
    """Raised when a profile operation is requested on a non-existent profile."""


def get_student_profile(db: Session, user: User) -> StudentProfile | None:
    """Retrieve the student profile belonging strictly to the authenticated user."""
    return db.scalar(select(StudentProfile).where(StudentProfile.user_id == user.id))


def get_onboarding_status(db: Session, user: User) -> OnboardingStatusResponse:
    """Determine whether the authenticated user has a profile and completed onboarding."""
    profile = get_student_profile(db, user)
    if not profile:
        return OnboardingStatusResponse(completed=False, profile_exists=False)
    return OnboardingStatusResponse(
        completed=bool(profile.onboarding_completed),
        profile_exists=True,
    )


def create_student_profile(
    db: Session,
    user: User,
    profile_data: StudentProfileCreate,
) -> StudentProfile:
    """Create a new student profile for the authenticated user."""
    existing = get_student_profile(db, user)
    if existing:
        raise ProfileAlreadyExistsError

    profile = StudentProfile(
        user_id=user.id,
        degree=profile_data.degree,
        branch=profile_data.branch,
        year_of_study=profile_data.year_of_study,
        graduation_year=profile_data.graduation_year,
        current_semester=profile_data.current_semester,
        daily_study_minutes=profile_data.daily_study_minutes,
        onboarding_completed=False,
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def update_student_profile(
    db: Session,
    user: User,
    profile_data: StudentProfileUpdate,
) -> StudentProfile:
    """Apply partial updates to the authenticated user's student profile."""
    profile = get_student_profile(db, user)
    if not profile:
        raise ProfileNotFoundError

    update_dict = profile_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile


def complete_onboarding(db: Session, user: User) -> StudentProfile:
    """Mark onboarding as completed for the authenticated user's profile."""
    profile = get_student_profile(db, user)
    if not profile:
        raise ProfileNotFoundError

    profile.onboarding_completed = True
    db.commit()
    db.refresh(profile)
    return profile
