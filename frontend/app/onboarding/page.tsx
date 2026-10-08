"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { onboardingApi } from "@/lib/api/onboarding"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { ProgressIndicator } from "@/components/onboarding/progress-indicator"
import { ProfileStep } from "@/components/onboarding/profile-step"
import { AcademicStep } from "@/components/onboarding/academic-step"
import { PreferencesStep } from "@/components/onboarding/preferences-step"
import { ReviewStep } from "@/components/onboarding/review-step"

const STEP_LABELS = ["Profile", "Academics", "Preferences", "Review"]

type FormData = {
  degree: string
  branch: string
  year_of_study: number | null
  graduation_year: number | null
  current_semester: number | null
  daily_study_minutes: number | null
}

const initialFormData: FormData = {
  degree: "",
  branch: "",
  year_of_study: null,
  graduation_year: null,
  current_semester: null,
  daily_study_minutes: null,
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [hasExistingProfile, setHasExistingProfile] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Pre-load onboarding status and existing profile data
  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      router.replace("/login")
      return
    }

    let isMounted = true

    async function checkStatus() {
      try {
        const status = await onboardingApi.getStatus()
        if (status.completed) {
          router.replace("/dashboard")
          return
        }

        if (status.profile_exists) {
          setHasExistingProfile(true)
          const profile = await onboardingApi.getProfile()
          if (isMounted) {
            setFormData({
              degree: profile.degree || "",
              branch: profile.branch || "",
              year_of_study: profile.year_of_study,
              graduation_year: profile.graduation_year,
              current_semester: profile.current_semester,
              daily_study_minutes: profile.daily_study_minutes,
            })
          }
        }
      } catch (err) {
        console.error("Failed to load onboarding status", err)
      } finally {
        if (isMounted) setIsInitializing(false)
      }
    }

    void checkStatus()

    return () => {
      isMounted = false
    }
  }, [authLoading, isAuthenticated, router])

  function handleFieldChange(field: string, value: string | number | null) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrorMessage(null)
  }

  async function handleCompleteSetup() {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const payload = {
        degree: formData.degree || null,
        branch: formData.branch || null,
        year_of_study: formData.year_of_study,
        graduation_year: formData.graduation_year,
        current_semester: formData.current_semester,
        daily_study_minutes: formData.daily_study_minutes,
      }

      if (hasExistingProfile) {
        await onboardingApi.updateProfile(payload)
      } else {
        try {
          await onboardingApi.createProfile(payload)
          setHasExistingProfile(true)
        } catch (createErr: unknown) {
          // If 409 conflict, profile exists so update it
          if (
            createErr &&
            typeof createErr === "object" &&
            "status" in createErr &&
            (createErr as { status: number }).status === 409
          ) {
            await onboardingApi.updateProfile(payload)
          } else {
            throw createErr
          }
        }
      }

      // Mark onboarding completed
      await onboardingApi.completeOnboarding()

      // Redirect to dashboard
      router.replace("/dashboard")
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "We couldn't finish setting up your workspace. Please try again."
      setErrorMessage(msg)
      setIsSubmitting(false)
    }
  }

  if (authLoading || isInitializing) {
    return (
      <OnboardingShell>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            Loading your setup...
          </p>
        </div>
      </OnboardingShell>
    )
  }

  return (
    <OnboardingShell>
      <ProgressIndicator
        currentStep={step}
        totalSteps={4}
        steps={STEP_LABELS}
      />

      {step === 1 && (
        <ProfileStep
          data={formData}
          userName={user?.full_name ? user.full_name.split(" ")[0] : undefined}
          onChange={handleFieldChange}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <AcademicStep
          selectedSemester={formData.current_semester}
          onSelectSemester={(sem) => handleFieldChange("current_semester", sem)}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <PreferencesStep
          selectedMinutes={formData.daily_study_minutes}
          onSelectMinutes={(mins) => handleFieldChange("daily_study_minutes", mins)}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <ReviewStep
          data={formData}
          isSubmitting={isSubmitting}
          error={errorMessage}
          onBack={() => setStep(3)}
          onComplete={handleCompleteSetup}
        />
      )}
    </OnboardingShell>
  )
}
