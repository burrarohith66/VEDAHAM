"""Profile management service for ongoing user and academic updates."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.student_profile import StudentProfile
from app.models.user import User
from app.schemas.onboarding import StudentProfileUpdate
from app.schemas.profile import ChangePasswordRequest, UserProfileRead, UserProfileUpdate


class StudentProfileNotFoundError(Exception):
    """Raised when an academic profile modification is requested on a non-existent profile."""


class InvalidCurrentPasswordError(Exception):
    """Raised when current password verification fails during password change."""


def get_combined_profile(db: Session, user: User) -> UserProfileRead:
    """Retrieve the authenticated user and their linked student profile."""
    student_profile = db.scalar(
        select(StudentProfile).where(StudentProfile.user_id == user.id)
    )
    return UserProfileRead(
        user=user,
        student_profile=student_profile,
    )


def update_user_account_profile(
    db: Session, user: User, payload: UserProfileUpdate
) -> User:
    """Update personal account fields for the authenticated user."""
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


def update_student_academic_profile(
    db: Session, user: User, payload: StudentProfileUpdate
) -> StudentProfile:
    """Update academic curriculum details for the authenticated user's student profile."""
    profile = db.scalar(
        select(StudentProfile).where(StudentProfile.user_id == user.id)
    )
    if not profile:
        raise StudentProfileNotFoundError("Student profile not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile


def change_user_password(
    db: Session, user: User, payload: ChangePasswordRequest
) -> User:
    """
    Verify current password, hash new password, persist update, and return updated User.
    Raises InvalidCurrentPasswordError if current password does not verify.
    """
    if not verify_password(payload.current_password, user.password_hash):
        raise InvalidCurrentPasswordError("Current password is incorrect.")

    user.password_hash = hash_password(payload.new_password)
    db.commit()
    db.refresh(user)
    return user
