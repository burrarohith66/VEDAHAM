"use client"

import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

type PreferencesStepProps = {
  selectedMinutes: number | null
  onSelectMinutes: (minutes: number) => void
  onBack: () => void
  onNext: () => void
}

const studyTimeOptions = [
  {
    minutes: 45,
    label: "Less than 1 hour",
    duration: "~45 mins / day",
    desc: "Light study, quick reviews, and concept refreshing.",
  },
  {
    minutes: 90,
    label: "1 – 2 hours",
    duration: "~1.5 hours / day",
    desc: "Steady progress, chapter reading, and regular practice.",
  },
  {
    minutes: 150,
    label: "2 – 3 hours",
    duration: "~2.5 hours / day",
    desc: "Deep coverage, exam prep, and problem sets.",
  },
  {
    minutes: 210,
    label: "3 – 4 hours",
    duration: "~3.5 hours / day",
    desc: "Intensive academic study and comprehensive topic mastery.",
  },
  {
    minutes: 300,
    label: "4+ hours",
    duration: "~5 hours / day",
    desc: "High dedication, competitive prep, and full curriculum dive.",
  },
]

export function PreferencesStep({
  selectedMinutes,
  onSelectMinutes,
  onBack,
  onNext,
}: PreferencesStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-primary-bright">
          Step 3 of 4 • Study Preferences
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          How much time can you usually study each day?
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Vedaham uses your availability to pace study modules comfortably without overwhelming you.
        </p>
      </div>

      <div className="space-y-3 pt-1">
        {studyTimeOptions.map((opt) => {
          const isSelected = selectedMinutes === opt.minutes
          return (
            <button
              key={opt.minutes}
              type="button"
              onClick={() => onSelectMinutes(opt.minutes)}
              className={`flex w-full items-center justify-between rounded-2xl p-4 text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isSelected
                  ? "border-2 border-primary bg-primary/15 text-foreground shadow-[0_0_25px_-5px_rgba(255,106,0,0.35)]"
                  : "border border-white/10 bg-black/30 hover:border-white/20 hover:bg-white/[0.04] text-muted-foreground"
              }`}
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isSelected ? "bg-primary text-black" : "bg-white/[0.06] text-muted-foreground"
                  }`}
                >
                  <Clock className="size-5" />
                </div>
                <div>
                  <p
                    className={`text-base font-semibold ${
                      isSelected ? "text-primary-bright" : "text-foreground"
                    }`}
                  >
                    {opt.label}
                  </p>
                  <p className="text-xs text-muted-foreground/80">{opt.desc}</p>
                </div>
              </div>

              <span
                className={`text-xs font-mono font-medium hidden sm:inline ${
                  isSelected ? "text-primary-bright" : "text-muted-foreground/70"
                }`}
              >
                {opt.duration}
              </span>
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
          disabled={selectedMinutes === null}
        >
          Review Setup →
        </Button>
      </div>
    </div>
  )
}
