"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { AuthFrame } from "@/components/auth/auth-frame"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/auth-client"

const inputClass = "h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.")
      return
    }
    setError("")
    setMessage("")
    setIsSubmitting(true)
    try {
      const response = await authClient.forgotPassword(email)
      setMessage(response.message)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return <AuthFrame title="Reset your password" description="Enter your email and we’ll send instructions when password reset delivery is enabled." footer={<>Remembered it? <Link href="/login" className="font-medium text-primary-bright hover:text-accent">Log in</Link></>}>
    <form noValidate onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5"><label htmlFor="email" className="text-sm font-medium">Email</label><input id="email" type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setError("") }} className={inputClass} aria-invalid={Boolean(error)} />{error && <p role="alert" className="text-xs text-red-300">{error}</p>}</div>
      {message && <p role="status" className="rounded-xl border border-primary/25 bg-primary/10 px-3 py-2.5 text-sm text-primary-bright">{message}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Requesting reset..." : "Request Password Reset"}</Button>
    </form>
  </AuthFrame>
}
