"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { Logo } from "@/components/marketing/logo"

type OnboardingShellProps = {
  children: ReactNode
}

export function OnboardingShell({ children }: OnboardingShellProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-background px-4 py-8 sm:px-6 sm:py-12">
      {/* Background glow and subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]"
        aria-hidden
      />

      <header className="relative mb-8 flex w-full max-w-xl items-center justify-between">
        <Link
          href="/"
          aria-label="Vedaham home"
          className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Logo />
        </Link>
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-primary-bright">
          Workspace Setup
        </span>
      </header>

      <section className="relative w-full max-w-xl">
        <div className="surface-accent rounded-3xl p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-9 border border-white/[0.08]">
          {children}
        </div>
      </section>
    </main>
  )
}
