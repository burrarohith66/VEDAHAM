import { ApiError } from "@/lib/api/client"
import type {
  OnboardingStatus,
  StudentProfile,
  StudentProfileCreateInput,
  StudentProfileUpdateInput,
} from "@/lib/types/onboarding"

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

export const onboardingApi = {
  getStatus(): Promise<OnboardingStatus> {
    return request<OnboardingStatus>("/api/onboarding/status")
  },

  getProfile(): Promise<StudentProfile> {
    return request<StudentProfile>("/api/onboarding")
  },

  createProfile(data: StudentProfileCreateInput): Promise<StudentProfile> {
    return request<StudentProfile>("/api/onboarding", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateProfile(data: StudentProfileUpdateInput): Promise<StudentProfile> {
    return request<StudentProfile>("/api/onboarding", {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  completeOnboarding(): Promise<StudentProfile> {
    return request<StudentProfile>("/api/onboarding/complete", {
      method: "POST",
    })
  },
}
