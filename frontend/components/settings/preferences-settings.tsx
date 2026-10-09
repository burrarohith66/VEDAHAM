"use client"

import { FormEvent, useEffect, useState } from "react"
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  Info,
  Layers,
  Loader2,
  RefreshCw,
  RotateCcw,
  Save,
  Sliders,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { profileApi } from "@/lib/api/profile"
import { ApiError } from "@/lib/api/client"
import { SettingsSection } from "./settings-section"
import type { StudentProfile } from "@/lib/types/onboarding"

type PresetOption = {
  minutes: number
  badge: string
  title: string
  description: string
  icon: typeof Clock
}

const PRESET_OPTIONS: PresetOption[] = [
  {
    minutes: 30,
    badge: "30 min",
    title: "Quick Daily Session",
    description: "Light daily touchpoint for steady habits.",
    icon: Zap,
  },
  {
    minutes: 45,
    badge: "45 min",
    title: "Light Study Routine",
    description: "Focused bite-sized study blocks.",
    icon: Timer,
  },
  {
    minutes: 60,
    badge: "1 hour",
    title: "One Hour a Day",
    description: "Balanced baseline for consistent progress.",
    icon: Clock,
  },
  {
    minutes: 90,
    badge: "1.5 hours",
    title: "Focused Study",
    description: "Deep conceptual coverage & active recall.",
    icon: Target,
  },
  {
    minutes: 120,
    badge: "2 hours",
    title: "Two Hours a Day",
    description: "Comprehensive subject mastery & practice.",
    icon: BookOpen,
  },
  {
    minutes: 150,
    badge: "2.5 hours",
    title: "Extended Study Session",
    description: "Thorough multi-topic review & revision.",
    icon: Layers,
  },
  {
    minutes: 180,
    badge: "3 hours",
    title: "Three Hours a Day",
    description: "Rigorous semester exam preparation.",
    icon: Flame,
  },
  {
    minutes: 240,
    badge: "4 hours",
    title: "Intensive Study Routine",
    description: "High-intensity syllabus acceleration.",
    icon: GraduationCap,
  },
  {
    minutes: 300,
    badge: "5 hours",
    title: "Peak Commitment",
    description: "Maximum dedicated daily learning budget.",
    icon: Trophy,
  },
]

function formatTimeDisplay(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}`
  }
  if (remainingMinutes === 0) {
    return `${hours} hour${hours === 1 ? "" : "s"}`
  }
  return `${hours} hour${hours === 1 ? "" : "s"} ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}`
}

export function PreferencesSettings() {
  const [, setStudentProfile] = useState<StudentProfile | null>(null)
  const [savedBaseline, setSavedBaseline] = useState<number | null>(null)
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null)
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false)
  const [customInput, setCustomInput] = useState<string>("")

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [clientErrors, setClientErrors] = useState<Record<string, string | undefined>>({})

  async function loadPreferences() {
    setIsLoading(true)
    setFetchError(null)
    try {
      const data = await profileApi.getProfile()
      const profile = data.student_profile
      setStudentProfile(profile)

      const savedValue = profile?.daily_study_minutes ?? null
      setSavedBaseline(savedValue)
      setSelectedMinutes(savedValue)

      if (savedValue !== null) {
        const isPreset = PRESET_OPTIONS.some((opt) => opt.minutes === savedValue)
        if (!isPreset) {
          setIsCustomMode(true)
          setCustomInput(String(savedValue))
        } else {
          setIsCustomMode(false)
          setCustomInput("")
        }
      } else {
        setIsCustomMode(false)
        setCustomInput("")
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setFetchError(err.message)
      } else {
        setFetchError("Unable to load study preferences. Please check your connection and try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadPreferences()
  }, [])

  // Calculate current active minute value based on mode
  const currentEffectiveMinutes: number | null = isCustomMode
    ? customInput.trim() !== "" && !isNaN(Number(customInput))
      ? Math.floor(Number(customInput))
      : null
    : selectedMinutes

  // Dirty state tracking against baseline
  const isDirty = currentEffectiveMinutes !== savedBaseline

  function handleSelectPreset(minutes: number) {
    setIsCustomMode(false)
    setSelectedMinutes(minutes)
    setCustomInput("")
    setClientErrors({})
    setSubmitError(null)
    setSuccessMessage(null)
  }

  function handleSelectCustomMode() {
    setIsCustomMode(true)
    if (selectedMinutes !== null && customInput === "") {
      setCustomInput(String(selectedMinutes))
    }
    setClientErrors({})
    setSubmitError(null)
    setSuccessMessage(null)
  }

  function handleClearTarget() {
    setIsCustomMode(false)
    setSelectedMinutes(null)
    setCustomInput("")
    setClientErrors({})
    setSubmitError(null)
    setSuccessMessage(null)
  }

  function handleReset() {
    setSelectedMinutes(savedBaseline)
    if (savedBaseline !== null) {
      const isPreset = PRESET_OPTIONS.some((opt) => opt.minutes === savedBaseline)
      if (!isPreset) {
        setIsCustomMode(true)
        setCustomInput(String(savedBaseline))
      } else {
        setIsCustomMode(false)
        setCustomInput("")
      }
    } else {
      setIsCustomMode(false)
      setCustomInput("")
    }
    setClientErrors({})
    setSubmitError(null)
    setSuccessMessage(null)
  }

  function validate(): boolean {
    const errors: Record<string, string | undefined> = {}

    if (isCustomMode) {
      if (customInput.trim() === "") {
        errors.custom = "Please enter your custom daily study minutes or choose a preset option."
      } else {
        const parsed = Number(customInput)
        if (!Number.isInteger(parsed) || isNaN(parsed)) {
          errors.custom = "Study time must be a valid whole number of minutes."
        } else if (parsed < 1) {
          errors.custom = "Daily study time must be at least 1 minute."
        } else if (parsed > 720) {
          errors.custom = "Daily study time cannot exceed 720 minutes (12 hours)."
        }
      }
    }

    setClientErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)
    setSuccessMessage(null)

    if (!validate()) {
      return
    }

    if (!isDirty) {
      return
    }

    setIsSaving(true)

    try {
      // Data-integrity requirement: submit ONLY daily_study_minutes
      const updatedProfile = await profileApi.updateStudyPreferences(currentEffectiveMinutes)
      setStudentProfile(updatedProfile)

      const confirmedMinutes = updatedProfile.daily_study_minutes ?? null
      setSavedBaseline(confirmedMinutes)
      setSelectedMinutes(confirmedMinutes)

      if (confirmedMinutes !== null) {
        const isPreset = PRESET_OPTIONS.some((opt) => opt.minutes === confirmedMinutes)
        if (!isPreset) {
          setIsCustomMode(true)
          setCustomInput(String(confirmedMinutes))
        } else {
          setIsCustomMode(false)
          setCustomInput("")
        }
      } else {
        setIsCustomMode(false)
        setCustomInput("")
      }

      setSuccessMessage(
        confirmedMinutes !== null
          ? `Daily study preference updated to ${formatTimeDisplay(confirmedMinutes)}!`
          : "Daily study preference cleared."
      )
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message)
      } else {
        setSubmitError("Failed to update study preferences. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SettingsSection
      title="Study Preferences"
      description="Select your daily study commitment to customize your study pace and revision schedules."
      badge="Daily Commitment"
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6" aria-busy="true" aria-live="polite">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/30 p-5">
            <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">Loading your study preferences...</span>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-white/[0.06] bg-black/40 p-4 space-y-3"
              >
                <div className="flex justify-between">
                  <div className="h-6 w-16 rounded-md bg-white/10" />
                  <div className="size-7 rounded-lg bg-white/5" />
                </div>
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="h-3 w-40 rounded bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fetch Error State with Retry Button */}
      {!isLoading && fetchError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-5 sm:p-6" role="alert">
          <div className="flex items-start gap-3.5">
            <AlertCircle className="size-5 shrink-0 text-red-400 mt-0.5" aria-hidden="true" />
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-red-200">Failed to load study preferences</h3>
              <p className="text-xs text-red-300/90 leading-relaxed">{fetchError}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void loadPreferences()}
                className="mt-3 border-red-500/40 text-red-200 hover:bg-red-500/10"
              >
                <RefreshCw className="size-3.5 mr-1.5" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Interface */}
      {!isLoading && !fetchError && (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Informational Guidance Callout */}
          <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs sm:text-sm text-muted-foreground">
            <Info className="size-4 sm:size-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              Your daily study allocation determines how Vedaham organizes your course reviews and practice sessions. You can adjust this commitment anytime as your semester demands shift.
            </p>
          </div>

          {/* Alert: Save Success */}
          {successMessage && (
            <div
              className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-300"
              role="status"
              aria-live="polite"
            >
              <CheckCircle2 className="size-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Alert: Submit Error */}
          {submitError && (
            <div
              className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-300"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="size-4 shrink-0 text-red-400" aria-hidden="true" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Selectable Preset Cards Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Choose Daily Target
              </label>
              {currentEffectiveMinutes !== null && (
                <button
                  type="button"
                  onClick={handleClearTarget}
                  disabled={isSaving}
                  className="text-xs text-muted-foreground hover:text-primary transition underline underline-offset-2"
                >
                  Clear target
                </button>
              )}
            </div>

            <div
              role="radiogroup"
              aria-label="Daily study time options"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {PRESET_OPTIONS.map((opt) => {
                const IconComponent = opt.icon
                const isSelected = !isCustomMode && selectedMinutes === opt.minutes

                return (
                  <button
                    key={opt.minutes}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={isSaving}
                    onClick={() => handleSelectPreset(opt.minutes)}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(255,106,0,0.12)] ring-1 ring-primary/40"
                        : "border-white/[0.08] bg-black/35 hover:border-white/20 hover:bg-black/50"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-3">
                      <span
                        className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition ${
                          isSelected
                            ? "bg-primary text-black font-bold shadow-sm"
                            : "bg-white/[0.06] text-foreground group-hover:bg-white/[0.09]"
                        }`}
                      >
                        {opt.badge}
                      </span>
                      <div
                        className={`flex size-8 items-center justify-center rounded-xl transition ${
                          isSelected
                            ? "bg-primary/20 text-primary-bright"
                            : "bg-white/[0.04] text-muted-foreground group-hover:text-foreground"
                        }`}
                        aria-hidden="true"
                      >
                        <IconComponent className="size-4" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">
                          {opt.title}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="size-4 text-primary shrink-0 ml-2" aria-hidden="true" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground/80 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                )
              })}

              {/* Custom Duration Selector Card */}
              <button
                type="button"
                role="radio"
                aria-checked={isCustomMode}
                disabled={isSaving}
                onClick={handleSelectCustomMode}
                className={`group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isCustomMode
                    ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(255,106,0,0.12)] ring-1 ring-primary/40"
                    : "border-white/[0.08] bg-black/35 hover:border-white/20 hover:bg-black/50"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span
                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition ${
                      isCustomMode
                        ? "bg-primary text-black font-bold shadow-sm"
                        : "bg-white/[0.06] text-foreground group-hover:bg-white/[0.09]"
                    }`}
                  >
                    Custom
                  </span>
                  <div
                    className={`flex size-8 items-center justify-center rounded-xl transition ${
                      isCustomMode
                        ? "bg-primary/20 text-primary-bright"
                        : "bg-white/[0.04] text-muted-foreground group-hover:text-foreground"
                    }`}
                    aria-hidden="true"
                  >
                    <Sliders className="size-4" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      Custom Target
                    </span>
                    {isCustomMode && (
                      <CheckCircle2 className="size-4 text-primary shrink-0 ml-2" aria-hidden="true" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground/80 leading-relaxed">
                    Set a personalized duration in minutes.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Custom Duration Numeric Input when Custom is Active */}
          {isCustomMode && (
            <div className="rounded-2xl border border-primary/30 bg-primary/[0.03] p-4.5 space-y-3">
              <label
                htmlFor="customMinutes"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <Sliders className="size-4 text-primary" aria-hidden="true" />
                <span>Custom Daily Study Minutes</span>
              </label>

              <div className="flex items-center gap-3">
                <input
                  id="customMinutes"
                  name="customMinutes"
                  type="number"
                  min={1}
                  max={720}
                  disabled={isSaving}
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value)
                    if (clientErrors.custom) {
                      setClientErrors((prev) => ({ ...prev, custom: undefined }))
                    }
                    if (successMessage) setSuccessMessage(null)
                  }}
                  placeholder="e.g. 75"
                  className={`h-11 w-40 rounded-xl border bg-black/60 px-3.5 text-sm font-mono text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    clientErrors.custom
                      ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                      : "border-white/10 hover:border-white/20"
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  minutes per day (1 to 720 min)
                </span>
              </div>

              {clientErrors.custom && (
                <p className="text-xs text-red-400 flex items-center gap-1.5" role="alert">
                  <AlertCircle className="size-3.5 shrink-0" />
                  {clientErrors.custom}
                </p>
              )}
            </div>
          )}

          {/* Study Routine Summary Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <Sparkles className="size-3.5 text-primary-bright" aria-hidden="true" />
              <span>Study Routine Summary</span>
            </div>

            {currentEffectiveMinutes !== null && currentEffectiveMinutes > 0 ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="size-3.5 text-primary" aria-hidden="true" />
                      <span>Daily Study Target</span>
                    </div>
                    <div className="mt-1.5 text-lg font-bold text-foreground">
                      {formatTimeDisplay(currentEffectiveMinutes)} per day
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground/70">
                      Target allocated for course review & practice
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="size-3.5 text-primary" aria-hidden="true" />
                      <span>Weekly Equivalent</span>
                    </div>
                    <div className="mt-1.5 text-lg font-bold text-foreground">
                      {formatTimeDisplay(currentEffectiveMinutes * 7)} per week
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground/70">
                      Calculated across standard 7-day study week
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground/70 leading-relaxed italic">
                  * Note: Weekly values represent a calculated estimate assuming consistent daily adherence. This indicates your planned study target preference and is not a measurement of verified learning time or past completion.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.01] p-4 text-center sm:text-left">
                <p className="text-sm font-medium text-foreground">
                  No daily study target selected yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Choose one of the cards above to configure your planned study allocation for AI schedule recommendations.
                </p>
              </div>
            )}
          </div>

          {/* Form Actions Card */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/[0.08] pt-5">
            <div className="flex items-center gap-2">
              {isDirty && (
                <span className="flex items-center gap-1.5 text-xs text-amber-400/90 font-medium animate-pulse">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Unsaved changes
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
              {isDirty && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isSaving}
                  onClick={handleReset}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3.5 mr-1.5" />
                  Reset
                </Button>
              )}

              <Button
                type="submit"
                size="default"
                disabled={isSaving || !isDirty}
                className="w-full sm:w-auto min-w-[130px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-1.5" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-4 mr-1.5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
    </SettingsSection>
  )
}
