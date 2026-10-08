import { GraduationCap, Lock, SlidersHorizontal, User, type LucideIcon } from "lucide-react"

export type SettingsSectionId = "profile" | "academic" | "preferences" | "security"

export interface SettingsNavSection {
  id: SettingsSectionId
  label: string
  shortLabel: string
  description: string
  icon: LucideIcon
}

export const SETTINGS_SECTIONS: SettingsNavSection[] = [
  {
    id: "profile",
    label: "Profile",
    shortLabel: "Profile",
    description: "Manage your personal account details and college information.",
    icon: User,
  },
  {
    id: "academic",
    label: "Academic Information",
    shortLabel: "Academic",
    description: "Manage your degree, branch, year of study, semester, and graduation details.",
    icon: GraduationCap,
  },
  {
    id: "preferences",
    label: "Study Preferences",
    shortLabel: "Preferences",
    description: "Configure your daily study commitment and learning pace.",
    icon: SlidersHorizontal,
  },
  {
    id: "security",
    label: "Security",
    shortLabel: "Security",
    description: "Manage your password and active session security.",
    icon: Lock,
  },
]

export const DEFAULT_SETTINGS_SECTION: SettingsSectionId = "profile"

export function isValidSettingsSection(section: string | null | undefined): section is SettingsSectionId {
  return section === "profile" || section === "academic" || section === "preferences" || section === "security"
}
