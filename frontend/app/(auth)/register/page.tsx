"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { AuthFrame } from "@/components/auth/auth-frame"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

type FormValues = { full_name: string; email: string; college: string; password: string; confirm_password: string }
type FieldName = keyof FormValues

const initialValues: FormValues = { full_name: "", email: "", college: "", password: "", confirm_password: "" }
const inputClass = "h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"

function validate(values: FormValues): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {}
  if (values.full_name.trim().length < 2) errors.full_name = "Enter your full name."
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Enter a valid email address."
  if (values.password.length < 8) errors.password = "Password must be at least 8 characters."
  if (values.confirm_password !== values.password) errors.confirm_password = "Passwords do not match."
  return errors
}

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function update(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setMessage("")
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setIsSubmitting(true)
    setMessage("")
    try {
      await register(values)
      router.replace("/dashboard")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthFrame
      title="Create your account"
      description="Start with a learning path that adapts to you."
      footer={<>Already have an account? <Link href="/login" className="font-medium text-primary-bright hover:text-accent">Log in</Link></>}
    >
      <form noValidate onSubmit={onSubmit} className="space-y-4">
        <Field label="Full name" error={errors.full_name}><input id="full_name" autoComplete="name" value={values.full_name} onChange={(e) => update("full_name", e.target.value)} className={inputClass} aria-invalid={Boolean(errors.full_name)} /></Field>
        <Field label="Email" error={errors.email}><input id="email" type="email" autoComplete="email" value={values.email} onChange={(e) => update("email", e.target.value)} className={inputClass} aria-invalid={Boolean(errors.email)} /></Field>
        <Field label="College or university (optional)" error={errors.college}><input id="college" autoComplete="organization" value={values.college} onChange={(e) => update("college", e.target.value)} className={inputClass} /></Field>
        <PasswordField id="password" label="Password" value={values.password} onChange={(value) => update("password", value)} error={errors.password} visible={showPassword} onToggle={() => setShowPassword((current) => !current)} />
        <PasswordField id="confirm_password" label="Confirm password" value={values.confirm_password} onChange={(value) => update("confirm_password", value)} error={errors.confirm_password} visible={showPassword} onToggle={() => setShowPassword((current) => !current)} />
        {message && <p role="alert" className="rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">{message}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create Account"}</Button>
      </form>
    </AuthFrame>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><label htmlFor={(children as React.ReactElement<{ id?: string }>).props.id} className="text-sm font-medium">{label}</label>{children}{error && <p role="alert" className="text-xs text-red-300">{error}</p>}</div>
}

function PasswordField({ id, label, value, onChange, error, visible, onToggle }: { id: string; label: string; value: string; onChange: (value: string) => void; error?: string; visible: boolean; onToggle: () => void }) {
  return <Field label={label} error={error}><div className="relative"><input id={id} type={visible ? "text" : "password"} autoComplete={id === "password" ? "new-password" : "new-password"} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} pr-12`} aria-invalid={Boolean(error)} /><button type="button" onClick={onToggle} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground" aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></Field>
}
