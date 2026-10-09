"use client"

import { FormEvent, useEffect, useState } from "react"
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Info,
  Layers,
  Loader2,
  RefreshCw,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { profileApi } from "@/lib/api/profile"
import { ApiError } from "@/lib/api/client"
import { SettingsSection } from "./settings-section"
import type { StudentProfile } from "@/lib/types/onboarding"

type AcademicFormState = {
  degree: string
  branch: string
  yearOfStudy: number | ""
  currentSemester: number | ""
  graduationYear: number | ""
}

const YEAR_OPTIONS = [
  { value: 1, label: "First Year (1st Year)" },
  { value: 2, label: "Second Year (2nd Year)" },
  { value: 3, label: "Third Year (3rd Year)" },
  { value: 4, label: "Fourth Year (4th Year)" },
]

const SEMESTER_OPTIONS = [
  { value: 1, label: "Semester 1" },
  { value: 2, label: "Semester 2" },
  { value: 3, label: "Semester 3" },
  { value: 4, label: "Semester 4" },
  { value: 5, label: "Semester 5" },
  { value: 6, label: "Semester 6" },
  { value: 7, label: "Semester 7" },
  { value: 8, label: "Semester 8" },
]

export function AcademicSettings() {
  const [, setStudentProfile] = useState<StudentProfile | null>(null)
  const [form, setForm] = useState<AcademicFormState>({
    degree: "",
    branch: "",
    yearOfStudy: "",
    currentSemester: "",
    graduationYear: "",
  })
  const [savedBaseline, setSavedBaseline] = useState<AcademicFormState>({
    degree: "",
    branch: "",
    yearOfStudy: "",
    currentSemester: "",
    graduationYear: "",
  })

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [clientErrors, setClientErrors] = useState<Record<string, string | undefined>>({})

  async function loadAcademicProfile() {
    setIsLoading(true)
    setFetchError(null)
    try {
      const data = await profileApi.getProfile()
      const profile = data.student_profile
      setStudentProfile(profile)

      const baseline: AcademicFormState = {
        degree: profile?.degree || "",
        branch: profile?.branch || "",
        yearOfStudy: profile?.year_of_study ?? "",
        currentSemester: profile?.current_semester ?? "",
        graduationYear: profile?.graduation_year ?? "",
      }
      setForm(baseline)
      setSavedBaseline(baseline)
    } catch (err) {
      if (err instanceof ApiError) {
        setFetchError(err.message)
      } else {
        setFetchError("Unable to load academic profile. Please check your connection and try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadAcademicProfile()
  }, [])

  const isDirty =
    form.degree !== savedBaseline.degree ||
    form.branch !== savedBaseline.branch ||
    form.yearOfStudy !== savedBaseline.yearOfStudy ||
    form.currentSemester !== savedBaseline.currentSemester ||
    form.graduationYear !== savedBaseline.graduationYear

  function handleReset() {
    setForm(savedBaseline)
    setClientErrors({})
    setSubmitError(null)
    setSuccessMessage(null)
  }

  function validate(state: AcademicFormState): boolean {
    const errors: Record<string, string | undefined> = {}

    if (state.degree && state.degree.trim().length > 120) {
      errors.degree = "Degree cannot exceed 120 characters."
    }

    if (state.branch && state.branch.trim().length > 150) {
      errors.branch = "Branch / Major cannot exceed 150 characters."
    }

    if (state.yearOfStudy !== "") {
      const y = Number(state.yearOfStudy)
      if (!Number.isInteger(y) || y < 1 || y > 4) {
        errors.yearOfStudy = "Year of study must be between 1 and 4."
      }
    }

    if (state.currentSemester !== "") {
      const sem = Number(state.currentSemester)
      if (!Number.isInteger(sem) || sem < 1 || sem > 8) {
        errors.currentSemester = "Current semester must be between 1 and 8."
      }
    }

    if (state.graduationYear !== "") {
      const gy = Number(state.graduationYear)
      if (!Number.isInteger(gy) || gy < 1900 || gy > 2100) {
        errors.graduationYear = "Graduation year must be between 1900 and 2100."
      }
    }

    setClientErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)
    setSuccessMessage(null)

    if (!validate(form)) {
      return
    }

    if (!isDirty) {
      return
    }

    setIsSaving(true)

    const payload: {
      degree?: string | null
      branch?: string | null
      year_of_study?: number | null
      graduation_year?: number | null
      current_semester?: number | null
    } = {}

    if (form.degree !== savedBaseline.degree) {
      payload.degree = form.degree.trim() ? form.degree.trim() : null
    }
    if (form.branch !== savedBaseline.branch) {
      payload.branch = form.branch.trim() ? form.branch.trim() : null
    }
    if (form.yearOfStudy !== savedBaseline.yearOfStudy) {
      payload.year_of_study = form.yearOfStudy !== "" ? Number(form.yearOfStudy) : null
    }
    if (form.currentSemester !== savedBaseline.currentSemester) {
      payload.current_semester = form.currentSemester !== "" ? Number(form.currentSemester) : null
    }
    if (form.graduationYear !== savedBaseline.graduationYear) {
      payload.graduation_year = form.graduationYear !== "" ? Number(form.graduationYear) : null
    }

    if (Object.keys(payload).length === 0) {
      setIsSaving(false)
      return
    }

    try {
      const updatedProfile = await profileApi.updateAcademicProfile(payload)
      setStudentProfile(updatedProfile)

      const nextBaseline: AcademicFormState = {
        degree: updatedProfile.degree || "",
        branch: updatedProfile.branch || "",
        yearOfStudy: updatedProfile.year_of_study ?? "",
        currentSemester: updatedProfile.current_semester ?? "",
        graduationYear: updatedProfile.graduation_year ?? "",
      }
      setForm(nextBaseline)
      setSavedBaseline(nextBaseline)
      setSuccessMessage("Academic information updated successfully!")
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message)
      } else {
        setSubmitError("Failed to update academic information. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SettingsSection
      title="Academic Information"
      description="Manage your university degree, branch or major, current year of study, semester, and expected graduation."
      badge="Academic Profile"
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6" aria-busy="true" aria-live="polite">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/30 p-5">
            <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">Loading your academic information...</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-white/[0.06] bg-black/40 p-5 space-y-3">
                <div className="h-3 w-24 rounded bg-white/10" />
                <div className="h-5 w-40 rounded bg-white/10" />
                <div className="h-2 w-32 rounded bg-white/5" />
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
              <h3 className="text-sm font-semibold text-red-200">Failed to load academic profile</h3>
              <p className="text-xs text-red-300/90 leading-relaxed">{fetchError}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void loadAcademicProfile()}
                className="mt-3 border-red-500/40 text-red-200 hover:bg-red-500/10"
              >
                <RefreshCw className="size-3.5 mr-1.5" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Interface */}
      {!isLoading && !fetchError && (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Informational Guidance Callout */}
          <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs sm:text-sm text-muted-foreground">
            <Info className="size-4 sm:size-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              Academic information personalizes your subjects, semester syllabus, and exam schedules. These settings remain strictly independent from your Skills roadmaps.
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

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Field: Degree (Editable, Optional, max 120) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="degree"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary-bright">
                    <GraduationCap className="size-3.5" aria-hidden="true" />
                  </span>
                  <span>Degree</span>
                  <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </label>
                <span className="text-xs font-mono text-muted-foreground/70">
                  {form.degree.length} / 120
                </span>
              </div>
              <input
                id="degree"
                name="degree"
                type="text"
                autoComplete="off"
                disabled={isSaving}
                maxLength={120}
                aria-invalid={Boolean(clientErrors.degree)}
                aria-describedby={clientErrors.degree ? "degree-error" : "degree-desc"}
                value={form.degree}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, degree: e.target.value }))
                  if (clientErrors.degree) {
                    setClientErrors((prev) => ({ ...prev, degree: undefined }))
                  }
                  if (successMessage) setSuccessMessage(null)
                }}
                placeholder="e.g. B.Tech, B.S., B.E., M.Tech"
                className={`h-11 w-full rounded-xl border bg-black/40 px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${
                  clientErrors.degree
                    ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                    : "border-white/10 hover:border-white/20"
                }`}
              />
              {clientErrors.degree ? (
                <p id="degree-error" className="text-xs text-red-400 flex items-center gap-1.5 mt-1" role="alert">
                  <AlertCircle className="size-3.5 shrink-0" />
                  {clientErrors.degree}
                </p>
              ) : (
                <p id="degree-desc" className="text-xs text-muted-foreground/80">
                  Your degree program or qualification title.
                </p>
              )}
            </div>

            {/* Field: Branch / Major (Editable, Optional, max 150) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="branch"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary-bright">
                    <BookOpen className="size-3.5" aria-hidden="true" />
                  </span>
                  <span>Branch / Major</span>
                  <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </label>
                <span className="text-xs font-mono text-muted-foreground/70">
                  {form.branch.length} / 150
                </span>
              </div>
              <input
                id="branch"
                name="branch"
                type="text"
                autoComplete="off"
                disabled={isSaving}
                maxLength={150}
                aria-invalid={Boolean(clientErrors.branch)}
                aria-describedby={clientErrors.branch ? "branch-error" : "branch-desc"}
                value={form.branch}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, branch: e.target.value }))
                  if (clientErrors.branch) {
                    setClientErrors((prev) => ({ ...prev, branch: undefined }))
                  }
                  if (successMessage) setSuccessMessage(null)
                }}
                placeholder="e.g. Computer Science and Engineering"
                className={`h-11 w-full rounded-xl border bg-black/40 px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${
                  clientErrors.branch
                    ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                    : "border-white/10 hover:border-white/20"
                }`}
              />
              {clientErrors.branch ? (
                <p id="branch-error" className="text-xs text-red-400 flex items-center gap-1.5 mt-1" role="alert">
                  <AlertCircle className="size-3.5 shrink-0" />
                  {clientErrors.branch}
                </p>
              ) : (
                <p id="branch-desc" className="text-xs text-muted-foreground/80">
                  Your primary academic discipline or department.
                </p>
              )}
            </div>

            {/* Grid: Year of Study & Current Semester */}
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Field: Year of Study (Dropdown, 1-4) */}
              <div className="space-y-2">
                <label
                  htmlFor="yearOfStudy"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary-bright">
                    <Calendar className="size-3.5" aria-hidden="true" />
                  </span>
                  <span>Year of Study</span>
                  <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </label>
                <select
                  id="yearOfStudy"
                  name="yearOfStudy"
                  disabled={isSaving}
                  aria-invalid={Boolean(clientErrors.yearOfStudy)}
                  aria-describedby={clientErrors.yearOfStudy ? "yearOfStudy-error" : "yearOfStudy-desc"}
                  value={form.yearOfStudy}
                  onChange={(e) => {
                    const val = e.target.value === "" ? "" : Number(e.target.value)
                    setForm((prev) => ({ ...prev, yearOfStudy: val }))
                    if (clientErrors.yearOfStudy) {
                      setClientErrors((prev) => ({ ...prev, yearOfStudy: undefined }))
                    }
                    if (successMessage) setSuccessMessage(null)
                  }}
                  className={`h-11 w-full rounded-xl border bg-black/40 px-3.5 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${
                    clientErrors.yearOfStudy
                      ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <option value="" className="bg-[#121212] text-muted-foreground">
                    Select Year of Study
                  </option>
                  {YEAR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#121212] text-foreground">
                      {opt.label}
                    </option>
                  ))}
                </select>
                {clientErrors.yearOfStudy ? (
                  <p id="yearOfStudy-error" className="text-xs text-red-400 flex items-center gap-1.5 mt-1" role="alert">
                    <AlertCircle className="size-3.5 shrink-0" />
                    {clientErrors.yearOfStudy}
                  </p>
                ) : (
                  <p id="yearOfStudy-desc" className="text-xs text-muted-foreground/80">
                    Current stage in your undergraduate degree.
                  </p>
                )}
              </div>

              {/* Field: Current Semester (Dropdown, 1-8) */}
              <div className="space-y-2">
                <label
                  htmlFor="currentSemester"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary-bright">
                    <Layers className="size-3.5" aria-hidden="true" />
                  </span>
                  <span>Current Semester</span>
                  <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </label>
                <select
                  id="currentSemester"
                  name="currentSemester"
                  disabled={isSaving}
                  aria-invalid={Boolean(clientErrors.currentSemester)}
                  aria-describedby={clientErrors.currentSemester ? "currentSemester-error" : "currentSemester-desc"}
                  value={form.currentSemester}
                  onChange={(e) => {
                    const val = e.target.value === "" ? "" : Number(e.target.value)
                    setForm((prev) => ({ ...prev, currentSemester: val }))
                    if (clientErrors.currentSemester) {
                      setClientErrors((prev) => ({ ...prev, currentSemester: undefined }))
                    }
                    if (successMessage) setSuccessMessage(null)
                  }}
                  className={`h-11 w-full rounded-xl border bg-black/40 px-3.5 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${
                    clientErrors.currentSemester
                      ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <option value="" className="bg-[#121212] text-muted-foreground">
                    Select Semester
                  </option>
                  {SEMESTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#121212] text-foreground">
                      {opt.label}
                    </option>
                  ))}
                </select>
                {clientErrors.currentSemester ? (
                  <p id="currentSemester-error" className="text-xs text-red-400 flex items-center gap-1.5 mt-1" role="alert">
                    <AlertCircle className="size-3.5 shrink-0" />
                    {clientErrors.currentSemester}
                  </p>
                ) : (
                  <p id="currentSemester-desc" className="text-xs text-muted-foreground/80">
                    Active academic term for coursework.
                  </p>
                )}
              </div>
            </div>

            {/* Field: Expected Graduation Year (Numeric input, 1900-2100) */}
            <div className="space-y-2">
              <label
                htmlFor="graduationYear"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary-bright">
                  <Calendar className="size-3.5" aria-hidden="true" />
                </span>
                <span>Expected Graduation Year</span>
                <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </label>
              <input
                id="graduationYear"
                name="graduationYear"
                type="number"
                min={1900}
                max={2100}
                disabled={isSaving}
                aria-invalid={Boolean(clientErrors.graduationYear)}
                aria-describedby={clientErrors.graduationYear ? "graduationYear-error" : "graduationYear-desc"}
                value={form.graduationYear}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Number(e.target.value)
                  setForm((prev) => ({ ...prev, graduationYear: val }))
                  if (clientErrors.graduationYear) {
                    setClientErrors((prev) => ({ ...prev, graduationYear: undefined }))
                  }
                  if (successMessage) setSuccessMessage(null)
                }}
                placeholder="e.g. 2026"
                className={`h-11 w-full rounded-xl border bg-black/40 px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${
                  clientErrors.graduationYear
                    ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                    : "border-white/10 hover:border-white/20"
                }`}
              />
              {clientErrors.graduationYear ? (
                <p id="graduationYear-error" className="text-xs text-red-400 flex items-center gap-1.5 mt-1" role="alert">
                  <AlertCircle className="size-3.5 shrink-0" />
                  {clientErrors.graduationYear}
                </p>
              ) : (
                <p id="graduationYear-desc" className="text-xs text-muted-foreground/80">
                  Four-digit graduation year between 1900 and 2100.
                </p>
              )}
            </div>
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
