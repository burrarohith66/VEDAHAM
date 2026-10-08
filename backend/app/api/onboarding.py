"""Student onboarding API endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.onboarding import (
    OnboardingStatusResponse,
    StudentProfileCreate,
    StudentProfileRead,
    StudentProfileUpdate,
)
from app.services.onboarding_service import (
    ProfileAlreadyExistsError,
    ProfileNotFoundError,
    complete_onboarding,
    create_student_profile,
    get_onboarding_status,
    get_student_profile,
    update_student_profile,
)

router = APIRouter(prefix="/api/onboarding", tags=["Onboarding"])
DbSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get("/status", response_model=OnboardingStatusResponse)
def status_endpoint(current_user: CurrentUser, db: DbSession) -> OnboardingStatusResponse:
    """Check whether the authenticated student has created a profile and completed onboarding."""
    return get_onboarding_status(db, current_user)


@router.get("", response_model=StudentProfileRead)
def get_profile(current_user: CurrentUser, db: DbSession) -> StudentProfileRead:
    """Retrieve the authenticated student's profile."""
    profile = get_student_profile(db, current_user)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        )
    return StudentProfileRead.model_validate(profile)


@router.post("", response_model=StudentProfileRead, status_code=status.HTTP_201_CREATED)
def create_profile(
    payload: StudentProfileCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> StudentProfileRead:
    """Create a student profile for the authenticated student."""
    try:
        profile = create_student_profile(db, current_user, payload)
    except (ProfileAlreadyExistsError, IntegrityError):
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student profile already exists",
        ) from None
    return StudentProfileRead.model_validate(profile)


@router.patch("", response_model=StudentProfileRead)
def update_profile(
    payload: StudentProfileUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> StudentProfileRead:
    """Partially update the authenticated student's profile."""
    try:
        profile = update_student_profile(db, current_user, payload)
    except ProfileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        ) from None
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid profile update data",
        ) from None
    return StudentProfileRead.model_validate(profile)


@router.post("/complete", response_model=StudentProfileRead)
def complete_endpoint(current_user: CurrentUser, db: DbSession) -> StudentProfileRead:
    """Mark onboarding as completed for the authenticated student's profile."""
    try:
        profile = complete_onboarding(db, current_user)
    except ProfileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        ) from None
    return StudentProfileRead.model_validate(profile)
