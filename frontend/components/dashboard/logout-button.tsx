"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export function LogoutButton() {
  const router = useRouter()
  const { logout } = useAuth()

  async function handleLogout() {
    await logout()
    router.replace("/login")
    router.refresh()
  }

  return <Button variant="outline" size="sm" onClick={() => void handleLogout()}>Log out</Button>
}
