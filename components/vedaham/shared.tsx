import { Check, Lock } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Reveal } from "./motion"

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8", className)}>{children}</div>
}

export function Section({
  id,
  children,
  className,
  glow,
}: {
  id?: string
  children: ReactNode
  className?: string
  glow?: "center" | "left" | "right"
}) {
  return (
    <section id={id} className={cn("relative overflow-hidden py-20 md:py-28", className)}>
      {glow && <Glow position={glow} />}
      <Container className="relative">{children}</Container>
    </section>
  )
}

export function Glow({ position = "center", className }: { position?: "center" | "left" | "right"; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 size-[520px] -translate-y-1/2 rounded-full bg-primary/[0.13] blur-[120px] md:size-[720px]",
        position === "center" && "left-1/2 -translate-x-1/2",
        position === "left" && "-left-60",
        position === "right" && "-right-60",
        className,
      )}
    />
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border-accent bg-primary/[0.06] px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-primary-bright",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_#ff6a00]" aria-hidden />
      {children}
    </span>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: "center" | "left"
  className?: string
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "max-w-2xl items-start",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-balance text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
      {description && <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>}
    </Reveal>
  )
}

export function MonoLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground", className)}>
      {children}
    </span>
  )
}

export type NodeStatus = "done" | "current" | "locked"

export function StatusIcon({ status, className }: { status: NodeStatus; className?: string }) {
  if (status === "done") {
    return (
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary-bright",
          className,
        )}
      >
        <Check className="size-3.5" strokeWidth={3} aria-hidden />
        <span className="sr-only">Completed</span>
      </span>
    )
  }
  if (status === "current") {
    return (
      <span className={cn("relative flex size-6 shrink-0 items-center justify-center", className)}>
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/40 motion-reduce:animate-none" aria-hidden />
        <span className="relative flex size-6 items-center justify-center rounded-full border border-primary bg-primary/20 shadow-[0_0_16px_rgba(255,106,0,0.8)]">
          <span className="size-2 rounded-full bg-brand" />
        </span>
        <span className="sr-only">In progress</span>
      </span>
    )
  }
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-muted-foreground/70",
        className,
      )}
    >
      <Lock className="size-3" aria-hidden />
      <span className="sr-only">Locked</span>
    </span>
  )
}

export function WindowChrome({ title, className }: { title?: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 border-b border-white/[0.06] px-4 py-3", className)}>
      <div className="flex gap-1.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-white/10" />
        <span className="size-2.5 rounded-full bg-white/10" />
        <span className="size-2.5 rounded-full bg-primary/60" />
      </div>
      {title && <span className="truncate font-mono text-[11px] text-muted-foreground">{title}</span>}
    </div>
  )
}

export function IllustrativeTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      Illustrative
    </span>
  )
}
