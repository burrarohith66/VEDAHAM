"use client"

import { Check } from "lucide-react"

type ProgressIndicatorProps = {
  currentStep: number // 1 to 4
  totalSteps: number
  steps: string[]
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  steps,
}: ProgressIndicatorProps) {
  return (
    <nav aria-label="Onboarding Progress" className="mb-8">
      {/* Visual step line and nodes */}
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary text-black font-bold shadow-[0_0_15px_rgba(255,106,0,0.5)]"
                      : isCurrent
                        ? "border-2 border-primary bg-primary/20 text-foreground ring-4 ring-primary/20"
                        : "border border-white/15 bg-white/[0.04] text-muted-foreground"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? <Check className="size-4" /> : stepNumber}
                </div>
                <span
                  className={`mt-2 hidden text-xs sm:inline font-medium tracking-tight ${
                    isCurrent
                      ? "text-primary-bright font-semibold"
                      : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground/70"
                  }`}
                >
                  {label}
                </span>
              </div>

              {stepNumber < totalSteps && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-colors duration-300 ${
                    stepNumber < currentStep ? "bg-primary" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
