import { AlertTriangle, Sparkles } from "lucide-react"
import { AnimatedBar, Reveal } from "./motion"
import { IllustrativeTag, MonoLabel, Section, SectionHeader } from "./shared"

const profile = [
  { name: "SQL", value: 72 },
  { name: "Normalization", value: 38 },
  { name: "ER Model", value: 90 },
  { name: "Transactions", value: 25 },
]
const sql = [
  { name: "SELECT", value: 92 },
  { name: "WHERE", value: 84 },
  { name: "JOIN", value: 42 },
  { name: "GROUP BY", value: 35 },
]

export function Mastery() {
  return (
    <Section id="mastery" className="border-y border-white/[0.04] bg-[#080808]">
      <SectionHeader
        eyebrow="Mastery Tracking"
        title={
          <>
            Don&apos;t just complete topics.
            <br />
            <span className="text-gradient">Master them.</span>
          </>
        }
        description="Mastery is based on performance evidence such as quizzes, practice, accuracy and review."
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        <Reveal className="flex flex-col gap-6 rounded-3xl surface p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em]">Knowledge Profile</h3>
            <IllustrativeTag />
          </div>
          <ul className="flex flex-col gap-4">
            {profile.map((p, i) => (
              <li key={p.name} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{p.value}%</span>
                </div>
                <AnimatedBar value={p.value} delay={i * 0.08} label={`${p.name} mastery`} />
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-6 rounded-3xl surface-accent p-6 md:p-8">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em]">SQL Breakdown</h3>
            <MonoLabel>Drill-down</MonoLabel>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {sql.map((s) => (
              <li
                key={s.name}
                className={
                  s.value < 50
                    ? "flex flex-col gap-1 rounded-2xl border border-primary/40 bg-primary/[0.08] p-4"
                    : "flex flex-col gap-1 rounded-2xl border border-white/[0.08] bg-black/40 p-4"
                }
              >
                <span className="font-mono text-[11px] text-muted-foreground">{s.name}</span>
                <span className={s.value < 50 ? "text-2xl font-semibold text-primary-bright" : "text-2xl font-semibold"}>
                  {s.value}%
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-black/40 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-primary-bright" aria-hidden />
              <div className="flex flex-col gap-0.5">
                <MonoLabel>Weak Area Detected</MonoLabel>
                <p className="text-sm font-medium">JOIN, GROUP BY</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-primary-bright" aria-hidden />
              <div className="flex flex-col gap-0.5">
                <MonoLabel>Recommended</MonoLabel>
                <p className="text-sm font-medium">15-minute JOIN practice</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
