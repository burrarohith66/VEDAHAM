import { Clock, Sparkles, BarChart3, Info } from "lucide-react"
import { SettingsSection } from "./settings-section"

export function PreferencesSettings() {
  return (
    <SettingsSection
      title="Study Preferences"
      description="Manage your daily study commitment and learning recommendations."
      badge="Preferences coming next"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm text-muted-foreground">
          <Info className="size-5 shrink-0 text-primary-bright mt-0.5" aria-hidden="true" />
          <p>
            Your study preferences determine how the VEDAHAM AI engine schedules your revision cycles, practice questions, and daily academic breakdowns.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <Clock className="size-4 text-primary-bright" aria-hidden="true" />
              <span>Daily Study Time</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              2 – 3 hours (150 min)
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">Committed daily budget</p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <BarChart3 className="size-4 text-primary-bright" aria-hidden="true" />
              <span>Academic Pace</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              Balanced & Regular
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">Exam & Skill distribution</p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <Sparkles className="size-4 text-primary-bright" aria-hidden="true" />
              <span>AI Context</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              Active & Adaptive
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">Tutor customization</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 sm:p-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Study Time & Learning Pace Sliders
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Updating your daily allocation will be wired to student_profiles.update_study_minutes.
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
