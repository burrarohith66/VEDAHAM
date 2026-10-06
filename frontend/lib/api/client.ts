import type { AuthUser, LoginInput, RegisterInput, SessionResponse } from "@/lib/auth/auth-types"

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

function apiUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
  if (!baseUrl) {
    throw new ApiError("Unable to connect to the server.", 0)
  }
  return `${baseUrl}${path}`
}

function messageFromPayload(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback
  const detail = "detail" in payload ? payload.detail : undefined
  if (typeof detail === "string") return detail
  if (Array.isArray(detail) && typeof detail[0]?.msg === "string") return detail[0].msg
  if ("message" in payload && typeof payload.message === "string") return payload.message
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
    throw new ApiError("Unable to connect to the server.", 0)
  }

  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(messageFromPayload(payload, "Something went wrong. Please try again."), response.status)
  }
  return payload as T
}

export const apiClient = {
  register(input: RegisterInput) {
    return request<SessionResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(input) })
  },
  login(input: LoginInput) {
    return request<SessionResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(input) })
  },
  logout() {
    return request<{ message: string }>("/api/auth/logout", { method: "POST" })
  },
  me() {
    return request<AuthUser>("/api/auth/me")
  },
  forgotPassword(email: string) {
    return request<{ message: string }>("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) })
  },
  resetPassword(input: { token: string; password: string; confirm_password: string }) {
    return request<{ message: string }>("/api/auth/reset-password", { method: "POST", body: JSON.stringify(input) })
  },
}
