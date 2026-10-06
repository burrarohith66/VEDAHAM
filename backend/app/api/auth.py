"""Cookie-based authentication endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.core.security import (
    ACCESS_COOKIE_NAME,
    REFRESH_COOKIE_NAME,
    create_access_token,
    create_refresh_token,
    get_current_user,
)
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserResponse,
)
from app.services.auth_service import DuplicateEmailError, authenticate_user, register_user

router = APIRouter(prefix="/api/auth", tags=["authentication"])
limiter = Limiter(key_func=get_remote_address)
DbSession = Annotated[Session, Depends(get_db)]


def _set_session_cookies(response: Response, user: User) -> None:
    settings = get_settings()
    cookie_options = {
        "httponly": True,
        "secure": settings.auth_cookie_secure,
        "samesite": "lax",
        "path": "/",
    }
    response.set_cookie(
        ACCESS_COOKIE_NAME,
        create_access_token(user.id, settings),
        max_age=settings.access_token_expire_minutes * 60,
        **cookie_options,
    )
    response.set_cookie(
        REFRESH_COOKIE_NAME,
        create_refresh_token(user.id, settings),
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        **cookie_options,
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register(request: Request, payload: RegisterRequest, response: Response, db: DbSession) -> TokenResponse:
    try:
        user = register_user(db, payload)
    except (DuplicateEmailError, IntegrityError):
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This email is already registered. Please log in instead.",
        ) from None

    _set_session_cookies(response, user)
    return TokenResponse(user=UserResponse.model_validate(user))


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def login(request: Request, payload: LoginRequest, response: Response, db: DbSession) -> TokenResponse:
    user = authenticate_user(db, str(payload.email), payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    _set_session_cookies(response, user)
    return TokenResponse(user=UserResponse.model_validate(user))


@router.post("/logout", response_model=MessageResponse)
def logout(response: Response) -> MessageResponse:
    response.delete_cookie(ACCESS_COOKIE_NAME, path="/")
    response.delete_cookie(REFRESH_COOKIE_NAME, path="/")
    return MessageResponse(message="You have been logged out.")


@router.get("/me", response_model=UserResponse)
def me(current_user: Annotated[User, Depends(get_current_user)]) -> UserResponse:
    return UserResponse.model_validate(current_user)


@router.post("/forgot-password", response_model=MessageResponse)
@limiter.limit("5/minute")
def forgot_password(request: Request, payload: ForgotPasswordRequest) -> MessageResponse:
    # Delivery and reset-token persistence will be introduced with an email provider.
    # The response intentionally does not reveal whether the account exists.
    return MessageResponse(message="If an account exists for that email, password reset instructions will be sent.")


@router.post("/reset-password", response_model=MessageResponse, status_code=status.HTTP_501_NOT_IMPLEMENTED)
@limiter.limit("5/minute")
def reset_password(request: Request, payload: ResetPasswordRequest) -> MessageResponse:
    # A reset token cannot be safely accepted until delivery and persistence are implemented.
    return MessageResponse(message="Password reset is not available yet.")
