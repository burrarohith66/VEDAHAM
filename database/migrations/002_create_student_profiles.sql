-- Migration: 002_create_student_profiles.sql
-- Description: Creates student_profiles table for student onboarding data.

CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    degree VARCHAR(120),
    branch VARCHAR(150),
    year_of_study INTEGER,
    graduation_year INTEGER,
    current_semester INTEGER,
    daily_study_minutes INTEGER,

    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_student_profiles_year_of_study
        CHECK (
            year_of_study IS NULL
            OR (year_of_study >= 1 AND year_of_study <= 4)
        ),

    CONSTRAINT chk_student_profiles_current_semester
        CHECK (
            current_semester IS NULL
            OR (current_semester >= 1 AND current_semester <= 8)
        ),

    CONSTRAINT chk_student_profiles_daily_study_minutes
        CHECK (
            daily_study_minutes IS NULL
            OR daily_study_minutes >= 0
        ),

    CONSTRAINT chk_student_profiles_graduation_year
        CHECK (
            graduation_year IS NULL
            OR (graduation_year >= 1900 AND graduation_year <= 2100)
        )
);