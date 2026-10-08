"""Student onboarding request and response schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class StudentProfileBase(BaseModel):
    degree: str | None = Field(default=None, max_length=120)
    branch: str | None = Field(default=None, max_length=150)
    year_of_study: int | None = Field(default=None, ge=1, le=4)
    graduation_year: int | None = Field(default=None, ge=1900, le=2100)
    current_semester: int | None = Field(default=None, ge=1, le=8)
    daily_study_minutes: int | None = Field(default=None, ge=0)


class StudentProfileCreate(StudentProfileBase):
    """
    Schema for initial profile creation during onboarding.
    Client cannot set id, user_id, onboarding_completed, created_at, or updated_at.
    """


class StudentProfileUpdate(BaseModel):
    """
    Schema for partial onboarding profile updates.
    All fields are optional. Client cannot update id, user_id, onboarding_completed, created_at, or updated_at.
    """

    degree: str | None = Field(default=None, max_length=120)
    branch: str | None = Field(default=None, max_length=150)
    year_of_study: int | None = Field(default=None, ge=1, le=4)
    graduation_year: int | None = Field(default=None, ge=1900, le=2100)
    current_semester: int | None = Field(default=None, ge=1, le=8)
    daily_study_minutes: int | None = Field(default=None, ge=0)


class StudentProfileRead(StudentProfileBase):
    """Schema representing the student profile returned to clients."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    onboarding_completed: bool = False
    created_at: datetime
    updated_at: datetime


class OnboardingStatusResponse(BaseModel):
    """Status summary determining whether the student profile exists and is completed."""

    completed: bool
    profile_exists: bool
