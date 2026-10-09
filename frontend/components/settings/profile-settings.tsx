"use client"

import { FormEvent, useEffect, useState } from "react"
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Info,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  RotateCcw,
  Save,
  Sparkles,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { profileApi } from "@/lib/api/profile"
import { ApiError } from "@/lib/api/client"
import { SettingsSection } from "./settings-section"
import type { AuthUser } from "@/lib/auth/auth-types"

type ProfileSettingsProps = {
  initialUserName?: string
  initialEmail?: string
}

type FormState = {
  fullName: string
  college: string
}

export function ProfileSettings({ initialUserName = "", initialEmail = "" }: ProfileSettingsProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [form, setForm] = useState<FormState>({
    fullName: initialUserName,
    college: "",
  })
  const [savedBaseline, setSavedBaseline] = useState<FormState>({
    fullName: initialUserName,
    college: "",
  })

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [clientErrors, setClientErrors] = useState<{ fullName?: string; college?: string }>({})

  async function loadProfile() {
    setIsLoading(true)
    setFetchError(null)
    try {
      const data = await profileApi.getProfile()
      const loadedUser = data.user
      setUser(loadedUser)
      const baseline: FormState = {
        fullName: loadedUser.full_name || "",
        college: loadedUser.college || "",
      }
      setForm(baseline)
      setSavedBaseline(baseline)
    } catch (err) {
      if (err instanceof ApiError) {
        setFetchError(err.message)
      } else {
        setFetchError("Unable to load profile. Please check your connection and try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadProfile()
  }, [])

  const isDirty = form.fullName !== savedBaseline.fullName || form.college !== savedBaseline.college

  function handleReset() {
    setForm(savedBaseline)
    setClientErrors({})
    setSubmitError(null)
    setSuccessMessage(null)
  }

  function validate(state: FormState): boolean {
    const errors: { fullName?: string; college?: string } = {}
    const trimmedName = state.fullName.trim()

    if (!trimmedName) {
      errors.fullName = "Full name is required."
    } else if (trimmedName.length < 2) {
      errors.fullName = "Full name must be at least 2 characters."
    } else if (trimmedName.length > 120) {
      errors.fullName = "Full name cannot exceed 120 characters."
    }

    if (state.college && state.college.trim().length > 255) {
      errors.college = "College / University cannot exceed 255 characters."
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
    const trimmedName = form.fullName.trim()
    const trimmedCollege = form.college.trim() ? form.college.trim() : null

    try {
      const updatedUser = await profileApi.updateUserProfile({
        full_name: trimmedName,
        college: trimmedCollege,
      })

      setUser(updatedUser)
      const nextBaseline: FormState = {
        fullName: updatedUser.full_name || "",
        college: updatedUser.college || "",
      }
      setForm(nextBaseline)
      setSavedBaseline(nextBaseline)
      setSuccessMessage("Profile updated successfully!")
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message)
      } else {
        setSubmitError("Failed to update profile. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SettingsSection
      title="Personal Profile"
      description="Manage your student account identity and college affiliation."
      badge="Account & Profile"
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6" aria-busy="true" aria-live="polite">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/30 p-5">
            <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">Loading your profile information...</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-white/[0.06] bg-black/40 p-5 space-y-3">
                <div className="h-3 w-20 rounded bg-white/10" />
                <div className="h-5 w-32 rounded bg-white/10" />
                <div className="h-2 w-24 rounded bg-white/5" />
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
              <h3 className="text-sm font-semibold text-red-200">Failed to load profile</h3>
              <p className="text-xs text-red-300/90 leading-relaxed">{fetchError}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void loadProfile()}
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
              Your personal information is displayed across your learning dashboard and tutor sessions. Your email address is permanently tied to your student account and cannot be modified.
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

          {/* Form Fields Grid */}
          <div className="space-y-5">
            {/* Field: Full Name (Editable, Required) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="fullName"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary-bright">
                    <User className="size-3.5" aria-hidden="true" />
                  </span>
                  <span>Full Name</span>
                  <span className="text-primary font-bold">*</span>
                </label>
                <span className="text-xs font-mono text-muted-foreground/70">
                  {form.fullName.length} / 120
                </span>
              </div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                disabled={isSaving}
                maxLength={120}
                required
                aria-required="true"
                aria-invalid={Boolean(clientErrors.fullName)}
                aria-describedby={clientErrors.fullName ? "fullName-error" : "fullName-desc"}
                value={form.fullName}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, fullName: e.target.value }))
                  if (clientErrors.fullName) {
                    setClientErrors((prev) => ({ ...prev, fullName: undefined }))
                  }
                  if (successMessage) setSuccessMessage(null)
                }}
                placeholder="e.g. Rohith Burra"
                className={`h-11 w-full rounded-xl border bg-black/40 px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${
                  clientErrors.fullName
                    ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                    : "border-white/10 hover:border-white/20"
                }`}
              />
              {clientErrors.fullName ? (
                <p id="fullName-error" className="text-xs text-red-400 flex items-center gap-1.5 mt-1" role="alert">
                  <AlertCircle className="size-3.5 shrink-0" />
                  {clientErrors.fullName}
                </p>
              ) : (
                <p id="fullName-desc" className="text-xs text-muted-foreground/80">
                  Your legal or preferred name displayed across the platform.
                </p>
              )}
            </div>

            {/* Field: Email Address (Read-only) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <span className="flex size-6 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
                    <Mail className="size-3.5" aria-hidden="true" />
                  </span>
                  <span>Email Address</span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    <Lock className="size-2.5" aria-hidden="true" />
                    Read-only
                  </span>
                </label>
              </div>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  readOnly
                  aria-readonly="true"
                  value={user?.email || initialEmail || ""}
                  tabIndex={-1}
                  className="h-11 w-full rounded-xl border border-white/[0.06] bg-black/25 px-3.5 text-sm text-muted-foreground/90 cursor-not-allowed outline-none select-all"
                />
              </div>
              <p className="text-xs text-muted-foreground/70">
                Email is permanently linked to your account for authentication and security notifications.
              </p>
            </div>

            {/* Field: College / University (Editable, Optional) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="college"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary-bright">
                    <Building2 className="size-3.5" aria-hidden="true" />
                  </span>
                  <span>College / University</span>
                  <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </label>
                <span className="text-xs font-mono text-muted-foreground/70">
                  {form.college.length} / 255
                </span>
              </div>
              <input
                id="college"
                name="college"
                type="text"
                autoComplete="organization"
                disabled={isSaving}
                maxLength={255}
                aria-invalid={Boolean(clientErrors.college)}
                aria-describedby={clientErrors.college ? "college-error" : "college-desc"}
                value={form.college}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, college: e.target.value }))
                  if (clientErrors.college) {
                    setClientErrors((prev) => ({ ...prev, college: undefined }))
                  }
                  if (successMessage) setSuccessMessage(null)
                }}
                placeholder="e.g. Indian Institute of Technology, Madras"
                className={`h-11 w-full rounded-xl border bg-black/40 px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${
                  clientErrors.college
                    ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                    : "border-white/10 hover:border-white/20"
                }`}
              />
              {clientErrors.college ? (
                <p id="college-error" className="text-xs text-red-400 flex items-center gap-1.5 mt-1" role="alert">
                  <AlertCircle className="size-3.5 shrink-0" />
                  {clientErrors.college}
                </p>
              ) : (
                <p id="college-desc" className="text-xs text-muted-foreground/80">
                  Your affiliated educational institution. Leave blank or clear to remove.
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

