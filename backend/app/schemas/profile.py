"""User profile and account settings schemas."""

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.auth import UserResponse
from app.schemas.onboarding import StudentProfileRead, StudentProfileUpdate


class UserProfileUpdate(BaseModel):
    """
    Schema for updating personal user account fields.
    Email, id, password_hash, is_active, timestamps are strictly excluded.
    """

    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    college: str | None = Field(default=None, max_length=255)

    @field_validator("full_name", mode="before")
    @classmethod
    def validate_full_name(cls, value: str | None) -> str | None:
        if value is not None:
            stripped = value.strip()
            if len(stripped) < 2:
                raise ValueError("Full name must be at least 2 characters.")
            return stripped
        return value

    @field_validator("college", mode="before")
    @classmethod
    def validate_college(cls, value: str | None) -> str | None:
        if isinstance(value, str):
            stripped = value.strip()
            return stripped if stripped else None
        return value


class UserProfileRead(BaseModel):
    """
    Combined profile read response containing user account info and student profile.
    Password hash is never included.
    """

    model_config = ConfigDict(from_attributes=True)

    user: UserResponse
    student_profile: StudentProfileRead | None = None


class ChangePasswordRequest(BaseModel):
    """
    Schema for authenticated student password change.
    Validates current password non-empty, new password 8-128 chars, confirm match,
    and disallows identical old and new passwords.
    """

    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)
    confirm_new_password: str = Field(min_length=8, max_length=128)

    @field_validator("new_password")
    @classmethod
    def validate_new_password_not_same(cls, value: str, info) -> str:
        current = info.data.get("current_password")
        if current is not None and value == current:
            raise ValueError("New password must be different from the current password.")
        return value

    @field_validator("confirm_new_password")
    @classmethod
    def validate_passwords_match(cls, value: str, info) -> str:
        new_pwd = info.data.get("new_password")
        if new_pwd is not None and value != new_pwd:
            raise ValueError("New passwords do not match.")
        return value
