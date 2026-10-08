import { GraduationCap, BookOpen, Calendar, Info } from "lucide-react"
import { SettingsSection } from "./settings-section"

export function AcademicSettings() {
  return (
    <SettingsSection
      title="Academic Information"
      description="Manage your degree, branch, year of study, semester, and graduation details."
      badge="Academic settings coming next"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm text-muted-foreground">
          <Info className="size-5 shrink-0 text-primary-bright mt-0.5" aria-hidden="true" />
          <p>
            Your academic context shapes your syllabus, subjects, and career roadmap. Updating your current semester or year will seamlessly align your learning modules.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <GraduationCap className="size-4 text-primary-bright" aria-hidden="true" />
              <span>Degree</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              B.Tech / B.E.
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">Undergraduate Program</p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <BookOpen className="size-4 text-primary-bright" aria-hidden="true" />
              <span>Branch / Major</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              Computer Science & Engineering
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">Academic Department</p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <Calendar className="size-4 text-primary-bright" aria-hidden="true" />
              <span>Current Semester</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              Semester 4 (2 nd Year)
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">Active Term</p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <Calendar className="size-4 text-primary-bright" aria-hidden="true" />
              <span>Graduation</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              Class of 2028
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">Projected Completion</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 sm:p-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Academic Curriculum Updater
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Promotion and semester transition editors will be connected to PATCH /api/profile/academic.
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
