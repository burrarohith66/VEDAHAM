import type { AuthUser } from "@/lib/auth/auth-types"
import type { StudentProfile } from "@/lib/types/onboarding"

export type UserProfileRead = {
  user: AuthUser
  student_profile: StudentProfile | null
}

export type UserProfileUpdateInput = {
  full_name?: string | null
  college?: string | null
}

export type ChangePasswordInput = {
  current_password: string
  new_password: string
  confirm_new_password: string
}

export type MessageResponse = {
  message: string
}
