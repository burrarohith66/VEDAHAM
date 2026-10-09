import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type SettingsSectionProps = {
  title: string
  description: string
  badge?: string
  children: ReactNode
  className?: string
}

export function SettingsSection({
  title,
  description,
  badge,
  children,
  className,
}: SettingsSectionProps) {
  const headingId = `section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "surface-accent rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-300",
        className
      )}
    >
      <header className="border-b border-white/[0.08] pb-5 sm:pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2
              id={headingId}
              className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {badge && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs font-medium text-primary-bright">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              {badge}
            </span>
          )}
        </div>
      </header>

      <div className="pt-6">{children}</div>
    </section>
  )
}
