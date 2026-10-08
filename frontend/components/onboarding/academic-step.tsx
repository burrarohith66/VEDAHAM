"use client"

import { Button } from "@/components/ui/button"

type AcademicStepProps = {
  selectedSemester: number | null
  onSelectSemester: (semester: number) => void
  onBack: () => void
  onNext: () => void
}

const semesters = [
  { id: 1, label: "Semester 1", desc: "First Year (Odd)" },
  { id: 2, label: "Semester 2", desc: "First Year (Even)" },
  { id: 3, label: "Semester 3", desc: "Second Year (Odd)" },
  { id: 4, label: "Semester 4", desc: "Second Year (Even)" },
  { id: 5, label: "Semester 5", desc: "Third Year (Odd)" },
  { id: 6, label: "Semester 6", desc: "Third Year (Even)" },
  { id: 7, label: "Semester 7", desc: "Final Year (Odd)" },
  { id: 8, label: "Semester 8", desc: "Final Year (Even)" },
]

export function AcademicStep({
  selectedSemester,
  onSelectSemester,
  onBack,
  onNext,
}: AcademicStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-primary-bright">
          Step 2 of 4 • Academic Context
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Which semester are you currently studying?
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          This helps Vedaham organize your subjects, syllabi, and academic milestones for your current term.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-1">
        {semesters.map((sem) => {
          const isSelected = selectedSemester === sem.id
          return (
            <button
              key={sem.id}
              type="button"
              onClick={() => onSelectSemester(sem.id)}
              className={`flex flex-col items-center justify-center rounded-2xl p-4 text-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isSelected
                  ? "border-2 border-primary bg-primary/15 text-foreground shadow-[0_0_25px_-5px_rgba(255,106,0,0.4)]"
                  : "border border-white/10 bg-black/30 hover:border-white/20 hover:bg-white/[0.04] text-muted-foreground"
              }`}
              aria-pressed={isSelected}
            >
              <span
                className={`text-base font-semibold ${
                  isSelected ? "text-primary-bright" : "text-foreground"
                }`}
              >
                {sem.label}
              </span>
              <span className="mt-1 text-[11px] text-muted-foreground/80">{sem.desc}</span>
            </button>
          )
        })}
      </div>

      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          ← Back
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={onNext}
          disabled={!selectedSemester}
        >
          Continue to Preferences →
        </Button>
      </div>
    </div>
  )
}
