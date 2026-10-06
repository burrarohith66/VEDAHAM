export type AuthUser = {
  id: string
  full_name: string
  email: string
  college: string | null
  is_active: boolean
  is_verified: boolean
  created_at: string
  last_login_at: string | null
}

export type RegisterInput = {
  full_name: string
  email: string
  password: string
  confirm_password: string
  college?: string
}

export type LoginInput = {
  email: string
  password: string
}

export type SessionResponse = {
  user: AuthUser
  token_type: "cookie"
}
