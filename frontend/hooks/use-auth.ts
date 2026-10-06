"use client"

import { useCallback, useEffect, useState } from "react"
import { authClient } from "@/lib/auth/auth-client"
import type { AuthUser, LoginInput, RegisterInput } from "@/lib/auth/auth-types"

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const currentUser = await authClient.me()
      setUser(currentUser)
      return currentUser
    } catch {
      setUser(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const register = useCallback(async (input: RegisterInput) => {
    const session = await authClient.register(input)
    setUser(session.user)
    return session.user
  }, [])

  const login = useCallback(async (input: LoginInput) => {
    const session = await authClient.login(input)
    setUser(session.user)
    return session.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authClient.logout()
    } finally {
      setUser(null)
    }
  }, [])

  return { user, isAuthenticated: Boolean(user), isLoading, refresh, register, login, logout }
}
