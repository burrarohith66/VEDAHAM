import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Settings } from "lucide-react"
import { LogoutButton } from "@/components/dashboard/logout-button"
import { Button } from "@/components/ui/button"
import type { AuthUser } from "@/lib/auth/auth-types"

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

export default async function DashboardPage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect("/login")

  return (
    <main className="min-h-screen bg-background px-5 py-8 sm:px-8">
      <section className="mx-auto max-w-5xl surface-accent rounded-3xl p-6 sm:p-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary-bright">Authenticated session</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Welcome, {user.full_name}</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">Your account is ready. Your personalized learning experience will be set up in onboarding.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings">
                <Settings className="size-4 mr-1.5" />
                Settings
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </section>
    </main>
  )
}
