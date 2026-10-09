import { ApiError } from "@/lib/api/client"
import type { AuthUser } from "@/lib/auth/auth-types"
import type { StudentProfile, StudentProfileUpdateInput } from "@/lib/types/onboarding"
import type {
  ChangePasswordInput,
  MessageResponse,
  UserProfileRead,
  UserProfileUpdateInput,
} from "@/lib/types/profile"

function apiUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
  if (!baseUrl) {
    throw new ApiError("Unable to connect to the server.", 0)
  }
  return `${baseUrl}${path}`
}

function messageFromPayload(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback
  const detail = "detail" in payload ? (payload as { detail: unknown }).detail : undefined
  if (typeof detail === "string") return detail
  if (Array.isArray(detail) && typeof detail[0]?.msg === "string") return detail[0].msg
  if ("message" in payload && typeof (payload as { message: unknown }).message === "string") {
    return (payload as { message: string }).message
  }
  return fallback
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(apiUrl(path), {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
  } catch {
    throw new ApiError("Unable to connect to the server. Please try again.", 0)
  }

  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(messageFromPayload(payload, "Something went wrong. Please try again."), response.status)
  }
  return payload as T
}

export const profileApi = {
  getProfile(): Promise<UserProfileRead> {
    return request<UserProfileRead>("/api/profile")
  },

  updateUserProfile(data: UserProfileUpdateInput): Promise<AuthUser> {
    return request<AuthUser>("/api/profile/user", {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  updateAcademicProfile(data: StudentProfileUpdateInput): Promise<StudentProfile> {
    return request<StudentProfile>("/api/profile/academic", {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  updateStudyPreferences(daily_study_minutes: number | null): Promise<StudentProfile> {
    return request<StudentProfile>("/api/profile/academic", {
      method: "PATCH",
      body: JSON.stringify({ daily_study_minutes }),
    })
  },

  changePassword(data: ChangePasswordInput): Promise<MessageResponse> {
    return request<MessageResponse>("/api/profile/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}
