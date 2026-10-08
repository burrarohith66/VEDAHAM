from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.auth import _set_session_cookies
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.auth import MessageResponse, UserResponse
from app.schemas.onboarding import StudentProfileRead, StudentProfileUpdate
from app.schemas.profile import ChangePasswordRequest, UserProfileRead, UserProfileUpdate
from app.services.profile_service import (
    InvalidCurrentPasswordError,
    StudentProfileNotFoundError,
    change_user_password,
    get_combined_profile,
    update_student_academic_profile,
    update_user_account_profile,
)

router = APIRouter(prefix="/api/profile", tags=["Profile"])
DbSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get("", response_model=UserProfileRead)
def get_profile(current_user: CurrentUser, db: DbSession) -> UserProfileRead:
    """Retrieve the authenticated student's combined account and academic profile."""
    return get_combined_profile(db, current_user)


@router.patch("/user", response_model=UserResponse)
def update_user_profile(
    payload: UserProfileUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> UserResponse:
    """Update personal account fields (full_name, college) for the authenticated student."""
    try:
        user = update_user_account_profile(db, current_user, payload)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid account update data",
        ) from None
    return UserResponse.model_validate(user)


@router.patch("/academic", response_model=StudentProfileRead)
def update_academic_profile(
    payload: StudentProfileUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> StudentProfileRead:
    """Update academic details (degree, branch, year, semester, study time) for the authenticated student."""
    try:
        profile = update_student_academic_profile(db, current_user, payload)
    except StudentProfileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        ) from None
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid academic update data",
        ) from None
    return StudentProfileRead.model_validate(profile)


@router.post("/change-password", response_model=MessageResponse)
def change_password(
    payload: ChangePasswordRequest,
    current_user: CurrentUser,
    response: Response,
    db: DbSession,
) -> MessageResponse:
    """Securely change account password and refresh the active authentication cookie."""
    try:
        user = change_user_password(db, current_user, payload)
    except InvalidCurrentPasswordError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect.",
        ) from None

    # Refresh authenticated session cookie
    _set_session_cookies(response, user)
    return MessageResponse(message="Password changed successfully.")
