"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { AuthFrame } from "@/components/auth/auth-frame"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

const inputClass = "h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = {
      email: /^\S+@\S+\.\S+$/.test(email) ? undefined : "Enter a valid email address.",
      password: password ? undefined : "Enter your password.",
    }
    setErrors(nextErrors)
    if (nextErrors.email || nextErrors.password) return
    setIsSubmitting(true)
    setMessage("")
    try {
      await login({ email, password })
      router.replace("/dashboard")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return <AuthFrame title="Welcome back" description="Pick up right where your learning path left off." footer={<>Don&apos;t have an account? <Link href="/register" className="font-medium text-primary-bright hover:text-accent">Create Account</Link></>}>
    <form noValidate onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5"><label htmlFor="email" className="text-sm font-medium">Email</label><input id="email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((current) => ({ ...current, email: undefined })) }} className={inputClass} aria-invalid={Boolean(errors.email)} />{errors.email && <p role="alert" className="text-xs text-red-300">{errors.email}</p>}</div>
      <div className="space-y-1.5"><div className="flex items-center justify-between gap-3"><label htmlFor="password" className="text-sm font-medium">Password</label><Link href="/forgot-password" className="text-xs font-medium text-primary-bright hover:text-accent">Forgot Password?</Link></div><div className="relative"><input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors((current) => ({ ...current, password: undefined })) }} className={`${inputClass} pr-12`} aria-invalid={Boolean(errors.password)} /><button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>{errors.password && <p role="alert" className="text-xs text-red-300">{errors.password}</p>}</div>
      {message && <p role="alert" className="rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">{message}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Log In"}</Button>
    </form>
  </AuthFrame>
}
