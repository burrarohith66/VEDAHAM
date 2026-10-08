import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { SettingsShell } from "@/components/settings/settings-shell"
import type { AuthUser } from "@/lib/auth/auth-types"

export const metadata = {
  title: "Settings — Vedaham",
  description: "Manage your Vedaham profile, academic details, study preferences, and account security.",
}

async function getAuthenticatedUser(): Promise<AuthUser | null> {
  const accessToken = (await cookies()).get("vedaham_access_token")?.value
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
  if (!accessToken || !apiUrl) return null

  try {
    const response = await fetch(`${apiUrl}/api/auth/me`, {
      headers: { cookie: `vedaham_access_token=${accessToken}` },
      cache: "no-store",
    })
    return response.ok ? ((await response.json()) as AuthUser) : null
  } catch {
    return null
  }
}

export default async function SettingsPage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect("/login")


  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SettingsShell userName={user.full_name} email={user.email} />
    </Suspense>
  )
}
