"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { LayoutDashboard, Settings as SettingsIcon } from "lucide-react"
import { Logo } from "@/components/marketing/logo"
import { LogoutButton } from "@/components/dashboard/logout-button"
import { Button } from "@/components/ui/button"
import {
  DEFAULT_SETTINGS_SECTION,
  isValidSettingsSection,
  type SettingsSectionId,
} from "./settings-types"
import { SettingsNavigation } from "./settings-navigation"
import { ProfileSettings } from "./profile-settings"
import { AcademicSettings } from "./academic-settings"
import { PreferencesSettings } from "./preferences-settings"
import { SecuritySettings } from "./security-settings"

type SettingsShellProps = {
  userName?: string
  email?: string
}

export function SettingsShell({ userName, email }: SettingsShellProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const rawSection = searchParams.get("section")
  const activeSection: SettingsSectionId = isValidSettingsSection(rawSection)
    ? rawSection
    : DEFAULT_SETTINGS_SECTION

  function handleSelectSection(sectionId: SettingsSectionId) {
    const params = new URLSearchParams(searchParams.toString())
    if (sectionId === DEFAULT_SETTINGS_SECTION) {
      params.delete("section")
    } else {
      params.set("section", sectionId)
    }

    const query = params.toString()
    router.push(query ? "/settings?" + query : "/settings")
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Background ambient glow matching dashboard */}
      <div
        className="pointer-events-none fixed inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl space-y-6 sm:space-y-8">
        {/* Top Header & Dashboard Navigation Bar */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-5 sm:pb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg focus-visible:outline-2 focus-visible:outline-primary"
              aria-label="Vedaham dashboard home"
            >
              <Logo />
            </Link>
            <span className="hidden h-5 w-px bg-white/15 sm:inline-block" aria-hidden="true" />
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/dashboard">
                  <LayoutDashboard className="size-4 mr-1" />
                  Dashboard
                </Link>
              </Button>
              <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary-bright">
                <SettingsIcon className="size-3.5" />
                Settings
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <Button variant="outline" size="sm" asChild className="sm:hidden">
              <Link href="/dashboard">
                <LayoutDashboard className="size-4 mr-1" />
                Dashboard
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </header>

        {/* Settings Page Title & Description */}
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-primary-bright font-semibold">
            Account & Preferences
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Settings
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Manage your profile, academic information, study preferences, and account security.
          </p>
        </div>

        {/* Section Navigation */}
        <SettingsNavigation
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
        />

        {/* Active Section Content with Subtle Motion */}
        <div id={`panel-${activeSection}`} role="tabpanel" aria-labelledby={`tab-${activeSection}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeSection === "profile" && (
                <ProfileSettings initialUserName={userName} initialEmail={email} />
              )}
              {activeSection === "academic" && <AcademicSettings />}
              {activeSection === "preferences" && <PreferencesSettings />}
              {activeSection === "security" && <SecuritySettings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
