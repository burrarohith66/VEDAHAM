import Link from "next/link"
import type { ReactNode } from "react"
import { Logo } from "@/components/marketing/logo"

type AuthFrameProps = {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

export function AuthFrame({ title, description, children, footer }: AuthFrameProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-70 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden />
      <div className="pointer-events-none absolute -top-48 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[130px]" aria-hidden />
      <section className="relative w-full max-w-md">
        <Link href="/" aria-label="Vedaham home" className="mb-9 inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-primary">
          <Logo />
        </Link>
        <div className="surface-accent rounded-3xl p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
          <div className="mb-7">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-bright">Vedaham account</p>
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
          {children}
          <div className="mt-7 border-t border-white/[0.08] pt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </section>
    </main>
  )
}
