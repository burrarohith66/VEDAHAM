import { User, Mail, Building2, Info } from "lucide-react"
import { SettingsSection } from "./settings-section"

type ProfileSettingsProps = {
  userName?: string
  email?: string
}

export function ProfileSettings({ userName, email }: ProfileSettingsProps) {
  return (
    <SettingsSection
      title="Personal Profile"
      description="Basic account information and institutional affiliation."
      badge="Profile forms coming next"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm text-muted-foreground">
          <Info className="size-5 shrink-0 text-primary-bright mt-0.5" aria-hidden="true" />
          <p>
            Manage your personal account identity and college affiliation. Your email is permanently linked to your learning record, while your full name and college can be updated at any time.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <User className="size-4 text-primary-bright" aria-hidden="true" />
              <span>Full Name</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              {userName || "Student Name"}
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">Editable via profile PATCH</p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <Mail className="size-4 text-primary-bright" aria-hidden="true" />
              <span>Email Address</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              {email || "student@example.com"}
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">Primary account identifier (read-only)</p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <Building2 className="size-4 text-primary-bright" aria-hidden="true" />
              <span>College / University</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              Institute Affiliation
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">Editable via profile PATCH</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 sm:p-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Profile Editor
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Inline editing for your full name and college name will be enabled in Milestone 3.5.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-muted-foreground">
            Ready for wiring
          </span>
        </div>
      </div>
    </SettingsSection>
  )
}
