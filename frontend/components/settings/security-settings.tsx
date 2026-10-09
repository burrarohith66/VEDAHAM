"use client"

import { FormEvent, useState } from "react"
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  RotateCcw,
  Shield,
  ShieldCheck,
  Info,
  Loader2,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { profileApi } from "@/lib/api/profile"
import { ApiError } from "@/lib/api/client"
import { SettingsSection } from "./settings-section"

export function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [clientErrors, setClientErrors] = useState<Record<string, string | undefined>>({})

  const isDirty = Boolean(currentPassword || newPassword || confirmPassword)

  // Live checklist indicators
  const hasMinLength = newPassword.length >= 8 && newPassword.length <= 128
  const isDifferent = Boolean(currentPassword && newPassword && newPassword !== currentPassword)
  const doesMatch = Boolean(newPassword && confirmPassword && newPassword === confirmPassword)

  function validate(): boolean {
    const errors: Record<string, string | undefined> = {}

    if (!currentPassword) {
      errors.currentPassword = "Enter your current password."
    } else if (currentPassword.length > 128) {
      errors.currentPassword = "Current password cannot exceed 128 characters."
    }

    if (!newPassword) {
      errors.newPassword = "Enter a new password."
    } else if (newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters long."
    } else if (newPassword.length > 128) {
      errors.newPassword = "New password cannot exceed 128 characters."
    } else if (currentPassword && newPassword === currentPassword) {
      errors.newPassword = "New password must be different from your current password."
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm your new password."
    } else if (confirmPassword.length > 128) {
      errors.confirmPassword = "Confirmation password cannot exceed 128 characters."
    } else if (newPassword && confirmPassword !== newPassword) {
      errors.confirmPassword = "Passwords do not match."
    }

    setClientErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleReset() {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setShowCurrent(false)
    setShowNew(false)
    setShowConfirm(false)
    setClientErrors({})
    setSubmitError(null)
    setSuccessMessage(null)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)
    setSuccessMessage(null)

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const res = await profileApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      })

      setSuccessMessage(res.message || "Password changed successfully! Your session has been securely refreshed.")
      // Clear sensitive secrets from state
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setShowCurrent(false)
      setShowNew(false)
      setShowConfirm(false)
      setClientErrors({})
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401 && err.message.toLowerCase().includes("current password")) {
          setClientErrors((prev) => ({
            ...prev,
            currentPassword: "The current password you entered is incorrect.",
          }))
          setSubmitError("The current password you entered is incorrect. Please verify and try again.")
        } else {
          setSubmitError(err.message)
        }
      } else {
        setSubmitError("Failed to change password. Please check your connection and try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SettingsSection
      title="Account Security"
      description="Protect your account by keeping your password strong, unique, and up to date."
      badge="Password & Security"
    >
      <div className="space-y-6">
        {/* Security Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <KeyRound className="size-4 text-primary-bright" aria-hidden="true" />
              <span>Password Status</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              Active & Protected
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">Secured with Argon2id</p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <Shield className="size-4 text-primary-bright" aria-hidden="true" />
              <span>Session Security</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              HTTP-Only Cookie
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">vedaham_access_token</p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="size-4 text-primary-bright" aria-hidden="true" />
              <span>Encryption</span>
            </div>
            <div className="mt-2.5 text-sm font-medium text-foreground">
              Cryptographic Salt & Hash
            </div>
            <p className="mt-1 text-xs text-muted-foreground/80">Zero plain-text storage</p>
          </div>
        </div>

        {/* Change Password Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Informational Guidance Callout */}
          <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs sm:text-sm text-muted-foreground">
            <Info className="size-4 sm:size-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              When you change your password, your active browser session cookie is refreshed automatically. You will remain logged in on this device.
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
            {/* Field: Current Password */}
            <div className="space-y-2">
              <label
                htmlFor="currentPassword"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary-bright">
                  <Lock className="size-3.5" aria-hidden="true" />
                </span>
                <span>Current Password</span>
                <span className="text-primary font-bold">*</span>
              </label>

              <div className="relative">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  maxLength={128}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(clientErrors.currentPassword)}
                  aria-describedby={clientErrors.currentPassword ? "currentPassword-error" : undefined}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value)
                    if (clientErrors.currentPassword) {
                      setClientErrors((prev) => ({ ...prev, currentPassword: undefined }))
                    }
                    if (submitError) setSubmitError(null)
                    if (successMessage) setSuccessMessage(null)
                  }}
                  placeholder="Enter your existing account password"
                  className={`h-11 w-full rounded-xl border bg-black/40 pl-3.5 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${
                    clientErrors.currentPassword
                      ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                      : "border-white/10 hover:border-white/20"
                  }`}
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowCurrent((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground transition outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-r-xl"
                  aria-label={showCurrent ? "Hide current password" : "Show current password"}
                >
                  {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {clientErrors.currentPassword && (
                <p id="currentPassword-error" className="text-xs text-red-400 flex items-center gap-1.5" role="alert">
                  <AlertCircle className="size-3.5 shrink-0" />
                  {clientErrors.currentPassword}
                </p>
              )}
            </div>

            {/* Field: New Password */}
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary-bright">
                  <KeyRound className="size-3.5" aria-hidden="true" />
                </span>
                <span>New Password</span>
                <span className="text-primary font-bold">*</span>
              </label>

              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  maxLength={128}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(clientErrors.newPassword)}
                  aria-describedby={clientErrors.newPassword ? "newPassword-error" : undefined}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    if (clientErrors.newPassword) {
                      setClientErrors((prev) => ({ ...prev, newPassword: undefined }))
                    }
                    if (submitError) setSubmitError(null)
                    if (successMessage) setSuccessMessage(null)
                  }}
                  placeholder="Enter at least 8 characters"
                  className={`h-11 w-full rounded-xl border bg-black/40 pl-3.5 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${
                    clientErrors.newPassword
                      ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                      : "border-white/10 hover:border-white/20"
                  }`}
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowNew((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground transition outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-r-xl"
                  aria-label={showNew ? "Hide new password" : "Show new password"}
                >
                  {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {clientErrors.newPassword && (
                <p id="newPassword-error" className="text-xs text-red-400 flex items-center gap-1.5" role="alert">
                  <AlertCircle className="size-3.5 shrink-0" />
                  {clientErrors.newPassword}
                </p>
              )}
            </div>

            {/* Field: Confirm New Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary-bright">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                </span>
                <span>Confirm New Password</span>
                <span className="text-primary font-bold">*</span>
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  maxLength={128}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(clientErrors.confirmPassword)}
                  aria-describedby={clientErrors.confirmPassword ? "confirmPassword-error" : undefined}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (clientErrors.confirmPassword) {
                      setClientErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                    }
                    if (submitError) setSubmitError(null)
                    if (successMessage) setSuccessMessage(null)
                  }}
                  placeholder="Re-enter your new password"
                  className={`h-11 w-full rounded-xl border bg-black/40 pl-3.5 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${
                    clientErrors.confirmPassword
                      ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                      : "border-white/10 hover:border-white/20"
                  }`}
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground transition outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-r-xl"
                  aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"}
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {clientErrors.confirmPassword && (
                <p id="confirmPassword-error" className="text-xs text-red-400 flex items-center gap-1.5" role="alert">
                  <AlertCircle className="size-3.5 shrink-0" />
                  {clientErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Password Validation Checklist */}
          {newPassword && (
            <div className="rounded-xl border border-white/[0.06] bg-black/25 p-3.5 space-y-2 text-xs">
              <span className="font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Password Requirements
              </span>
              <ul className="space-y-1.5 pt-1">
                <li className={`flex items-center gap-2 ${hasMinLength ? "text-emerald-400" : "text-muted-foreground"}`}>
                  <span className={`flex size-4 items-center justify-center rounded-full ${hasMinLength ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-muted-foreground"}`}>
                    <Check className="size-2.5" />
                  </span>
                  <span>Between 8 and 128 characters</span>
                </li>
                <li className={`flex items-center gap-2 ${isDifferent ? "text-emerald-400" : "text-muted-foreground"}`}>
                  <span className={`flex size-4 items-center justify-center rounded-full ${isDifferent ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-muted-foreground"}`}>
                    <Check className="size-2.5" />
                  </span>
                  <span>Different from your current password</span>
                </li>
                {confirmPassword && (
                  <li className={`flex items-center gap-2 ${doesMatch ? "text-emerald-400" : "text-muted-foreground"}`}>
                    <span className={`flex size-4 items-center justify-center rounded-full ${doesMatch ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-muted-foreground"}`}>
                      <Check className="size-2.5" />
                    </span>
                    <span>Passwords match</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Form Actions Card */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/[0.08] pt-5">
            <div className="flex items-center gap-2">
              {isDirty && (
                <span className="flex items-center gap-1.5 text-xs text-amber-400/90 font-medium">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Unsaved password entry
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
              {isDirty && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={handleReset}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3.5 mr-1.5" />
                  Clear
                </Button>
              )}

              <Button
                type="submit"
                size="default"
                disabled={isSubmitting || !isDirty}
                className="w-full sm:w-auto min-w-[150px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-1.5" />
                    Updating...
                  </>
                ) : (
                  <>
                    <KeyRound className="size-4 mr-1.5" />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </SettingsSection>
  )
}
