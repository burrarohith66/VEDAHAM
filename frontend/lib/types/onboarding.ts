export type StudentProfile = {
  id: string
  user_id: string
  degree: string | null
  branch: string | null
  year_of_study: number | null
  graduation_year: number | null
  current_semester: number | null
  daily_study_minutes: number | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export type StudentProfileCreateInput = {
  degree?: string | null
  branch?: string | null
  year_of_study?: number | null
  graduation_year?: number | null
  current_semester?: number | null
  daily_study_minutes?: number | null
}

export type StudentProfileUpdateInput = {
  degree?: string | null
  branch?: string | null
  year_of_study?: number | null
  graduation_year?: number | null
  current_semester?: number | null
  daily_study_minutes?: number | null
}

export type OnboardingStatus = {
  completed: boolean
  profile_exists: boolean
}
