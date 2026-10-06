"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { AuthFrame } from "@/components/auth/auth-frame"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/auth-client"

const inputClass = "h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"

export default function ResetPasswordPage() {
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token || password.length < 8 || password !== confirmPassword) {
      setMessage("Enter a reset token and matching password of at least 8 characters.")
      return
    }
    setIsSubmitting(true)
    setMessage("")
    try {
      const response = await authClient.resetPassword({ token, password, confirm_password: confirmPassword })
      setMessage(response.message)
    } catch (requestError) {
      setMessage(requestError instanceof Error ? requestError.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return <AuthFrame title="Choose a new password" description="Reset links will provide the secure token required below." footer={<>Back to <Link href="/login" className="font-medium text-primary-bright hover:text-accent">Log in</Link></>}>
    <form noValidate onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5"><label htmlFor="token" className="text-sm font-medium">Reset token</label><input id="token" value={token} onChange={(event) => setToken(event.target.value)} className={inputClass} /></div>
      <div className="space-y-1.5"><label htmlFor="password" className="text-sm font-medium">New password</label><input id="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} /></div>
      <div className="space-y-1.5"><label htmlFor="confirm-password" className="text-sm font-medium">Confirm new password</label><input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClass} /></div>
      {message && <p role="alert" className="rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">{message}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Saving password..." : "Reset Password"}</Button>
    </form>
  </AuthFrame>
}
