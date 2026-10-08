import { Lock, KeyRound, ShieldCheck, Info } from "lucide-react"
import { SettingsSection } from "./settings-section"

export function SecuritySettings() {
  return (
    <SettingsSection
      title="Account Security"
      description="Manage your password, active sessions, and security preferences."
      badge="Security forms coming next"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm text-muted-foreground">
          <Info className="size-5 shrink-0 text-primary-bright mt-0.5" aria-hidden="true" />
          <p>
            Your account is secured with Argon2 password hashing and HTTP-only session cookies. Changing your password will refresh your active session automatically.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <Lock className="size-4 text-primary-bright" aria-hidden="true" />
              <span>Password</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              ‐‐‐‐‐‐‐‐‐‐
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">Active and protected</p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <KeyRound className="size-4 text-primary-bright" aria-hidden="true" />
              <span>Authentication</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              Secure HTTP-Only Session
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">vedaham_access_token</p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="size-4 text-primary-bright" aria-hidden="true" />
              <span>Crypto Protection</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              Argon2id / Key derivation
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">Industry grade encryption</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 sm:p-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Change Password Form
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Active form wiring to POST /api/profile/change-password will be added in Milestone 3.7.
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
