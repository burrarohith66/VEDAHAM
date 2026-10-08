"use client"

import { Button } from "@/components/ui/button"

type ReviewStepProps = {
  data: {
    degree: string
    branch: string
    year_of_study: number | null
    graduation_year: number | null
    current_semester: number | null
    daily_study_minutes: number | null
  }
  isSubmitting: boolean
  error?: string | null
  onBack: () => void
  onComplete: () => void
}

function getStudyLabel(minutes: number | null): string {
  if (!minutes) return "Not specified"
  if (minutes <= 60) return "Less than 1 hour (~45 mins / day)"
  if (minutes <= 120) return "1 – 2 hours (~90 mins / day)"
  if (minutes <= 180) return "2 – 3 hours (~150 mins / day)"
  if (minutes <= 240) return "3 – 4 hours (~210 mins / day)"
  return "4+ hours (~300 mins / day)"
}

export function ReviewStep({
  data,
  isSubmitting,
  error,
  onBack,
  onComplete,
}: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-primary-bright">
          Step 4 of 4 • Confirmation
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Review your workspace setup
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Double check your academic details below. You can update these anytime later in your settings.
        </p>
      </div>

      <div className="divide-y divide-white/[0.08] rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
        {/* Profile Group */}
        <div className="p-4 sm:p-5 space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-wider text-primary-bright font-semibold">
            Academic Profile
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground block text-xs">Degree</span>
              <span className="font-medium text-foreground">{data.degree || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Branch / Major</span>
              <span className="font-medium text-foreground">{data.branch || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Year of Study</span>
              <span className="font-medium text-foreground">
                {data.year_of_study ? `${data.year_of_study} Year` : "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Expected Graduation</span>
              <span className="font-medium text-foreground">{data.graduation_year || "—"}</span>
            </div>
          </div>
        </div>

        {/* Current Term Group */}
        <div className="p-4 sm:p-5 space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-wider text-primary-bright font-semibold">
            Current Semester
          </p>
          <p className="text-sm font-medium text-foreground">
            {data.current_semester ? `Semester ${data.current_semester}` : "—"}
          </p>
        </div>

        {/* Study Availability */}
        <div className="p-4 sm:p-5 space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-wider text-primary-bright font-semibold">
            Study Availability
          </p>
          <p className="text-sm font-medium text-foreground">
            {getStudyLabel(data.daily_study_minutes)}
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200 leading-relaxed"
        >
          {error}
        </div>
      )}

      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={isSubmitting}
        >
          ← Back
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={onComplete}
          disabled={isSubmitting}
          className="min-w-44"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
              Setting up workspace...
            </span>
          ) : (
            "Complete Setup →"
          )}
        </Button>
      </div>
    </div>
  )
}
