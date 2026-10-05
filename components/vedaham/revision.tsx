import { BrainCircuit, CalendarCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Reveal } from "./motion"
import { MonoLabel, Section, SectionHeader } from "./shared"

const timeline = [
  { day: "Today", label: "Learned", strong: true },
  { day: "Day 1", label: "Quick Recall" },
  { day: "Day 4", label: "Practice Review" },
  { day: "Day 7", label: "Mastery Check" },
]
const reviewDays = new Set([0, 1, 4, 7])

export function Revision() {
  return (
    <Section id="revision" glow="center">
      <SectionHeader
        eyebrow="Smart Revision"
        title={
          <>
            Remember more.
            <br />
            <span className="text-gradient">Revise smarter.</span>
          </>
        }
        description="Vedaham schedules revision based on your mastery and learning history."
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="flex flex-col gap-8 rounded-3xl surface p-6 md:p-8">
          <MonoLabel>Revision Timeline · SQL JOIN</MonoLabel>
          <ol className="relative grid grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-3">
            <span
              className="absolute bottom-4 left-[15px] top-4 w-px bg-gradient-to-b from-primary to-primary/20 sm:bottom-auto sm:left-4 sm:right-4 sm:top-[15px] sm:h-px sm:w-auto sm:bg-gradient-to-r"
              aria-hidden
            />
            {timeline.map((t) => (
              <li key={t.day} className="relative flex items-center gap-4 sm:flex-col sm:items-start sm:gap-4">
                <span
                  className={cn(
                    "relative flex size-8 shrink-0 items-center justify-center rounded-full border",
                    t.strong ? "border-transparent bg-brand text-black" : "border-primary/50 bg-[#120a04] text-primary-bright",
                  )}
                >
                  <span className={cn("size-2 rounded-full", t.strong ? "bg-black" : "bg-primary")} />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{t.day}</span>
                  <span className="text-sm font-medium">{t.label}</span>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarCheck className="size-3.5 text-primary-bright" aria-hidden />
              Upcoming reviews this week
            </div>
            <ul className="grid grid-cols-8 gap-1.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center rounded-lg border font-mono text-[10px]",
                    i === 0
                      ? "border-transparent bg-brand font-semibold text-black"
                      : reviewDays.has(i)
                        ? "border-primary/50 bg-primary/10 text-primary-bright"
                        : "border-white/[0.06] bg-white/[0.02] text-muted-foreground",
                  )}
                >
                  <span className="sr-only">Day </span>
                  {`D${i}`}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col justify-between gap-6 rounded-3xl surface-accent p-6 glow-orange md:p-8">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-brand text-black">
            <BrainCircuit className="size-5" aria-hidden />
          </span>
          <p className="text-balance text-2xl font-semibold leading-snug tracking-tight">
            Topics you&apos;re more likely to forget <span className="text-gradient">come back for review.</span>
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Lower-mastery topics are revisited sooner, while strong topics are spaced further apart.
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
