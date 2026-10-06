import { ArrowRight, GitBranch, ListTree, Map, Sparkles, Upload, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedBar, Reveal } from "./motion"
import { IllustrativeTag, MonoLabel, Section, SectionHeader, StatusIcon, WindowChrome, type NodeStatus } from "./shared"

const steps: { n: string; label: string; icon: LucideIcon }[] = [
  { n: "01", label: "Upload Syllabus", icon: Upload },
  { n: "02", label: "AI extracts topics", icon: ListTree },
  { n: "03", label: "AI maps prerequisites", icon: GitBranch },
  { n: "04", label: "Personalized roadmap", icon: Map },
]

const before: { name: string; status: NodeStatus }[] = [
  { name: "Database Fundamentals", status: "done" },
  { name: "ER Model", status: "done" },
  { name: "Relational Model", status: "done" },
]
const sqlSubtopics = [
  { name: "SELECT", value: 92 },
  { name: "WHERE", value: 84 },
  { name: "JOIN", value: 42, focus: true },
  { name: "GROUP BY", value: 35 },
]
const after = ["Normalization", "Transactions"]

export function Academics() {
  return (
    <Section id="academics">
      <SectionHeader
        eyebrow="Academics"
        title={
          <>
            Turn your syllabus into a <span className="text-gradient">personalized learning journey.</span>
          </>
        }
        description="Upload a syllabus PDF and Vedaham transforms it into a structured academic roadmap."
      />

      <ol className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal
            as="li"
            key={s.n}
            delay={i * 0.08}
            className="group flex h-full flex-col gap-4 rounded-2xl surface p-4 transition-colors duration-500 hover:border-primary/40 md:p-5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-primary-bright">{s.n}</span>
              <s.icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary-bright" aria-hidden />
            </div>
            <span className="text-sm font-medium leading-snug md:text-base">{s.label}</span>
          </Reveal>
        ))}
      </ol>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="overflow-hidden rounded-3xl surface">
          <WindowChrome title="vedaham / roadmap / dbms" />
          <div className="flex flex-col gap-5 p-5 md:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-foreground sm:text-sm">
                Database Management Systems
              </h3>
              <IllustrativeTag />
            </div>

            <ul className="relative flex flex-col gap-3">
              <span className="absolute bottom-3 left-[11px] top-3 w-px bg-gradient-to-b from-primary/60 via-primary/40 to-white/10" aria-hidden />
              {before.map((t) => (
                <li key={t.name} className="relative flex items-center gap-3">
                  <StatusIcon status={t.status} />
                  <span className="text-sm">{t.name}</span>
                </li>
              ))}

              <li className="relative flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <StatusIcon status="current" />
                  <span className="text-sm font-semibold">SQL</span>
                </div>
                <ul className="ml-9 flex flex-col gap-1 rounded-2xl border border-white/[0.06] bg-black/40 p-3">
                  {sqlSubtopics.map((s, i) => (
                    <li
                      key={s.name}
                      className={
                        s.focus
                          ? "flex flex-col gap-2 rounded-xl border border-primary/40 bg-primary/[0.08] p-2.5 shadow-[0_0_30px_-6px_rgba(255,106,0,0.5)]"
                          : "flex flex-col gap-2 p-2.5"
                      }
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs">{s.name}</span>
                        <span className="flex items-center gap-2">
                          {s.focus && (
                            <span className="hidden rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-black sm:inline">
                              Current Focus
                            </span>
                          )}
                          <span className={s.focus ? "font-mono text-xs text-primary-bright" : "font-mono text-xs text-muted-foreground"}>
                            {s.value}%
                          </span>
                        </span>
                      </div>
                      <AnimatedBar value={s.value} delay={i * 0.1} className="h-1.5" label={`${s.name} mastery`} />
                      {s.focus && (
                        <span className="text-[11px] font-medium text-primary-bright sm:hidden">Current Focus</span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>

              {after.map((t) => (
                <li key={t} className="relative flex items-center gap-3">
                  <StatusIcon status="locked" />
                  <span className="text-sm text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="flex">
          <div className="relative flex w-full flex-col gap-5 overflow-hidden rounded-3xl surface-accent p-6 glow-orange md:p-7">
            <span className="absolute -right-20 -top-20 size-56 rounded-full bg-primary/20 blur-3xl" aria-hidden />
            <span className="relative flex size-11 items-center justify-center rounded-2xl bg-brand text-black">
              <Sparkles className="size-5" aria-hidden />
            </span>
            <div className="relative flex flex-col gap-2">
              <MonoLabel className="text-primary-bright">AI Recommendation</MonoLabel>
              <p className="text-2xl font-semibold tracking-tight">Practice SQL JOIN</p>
            </div>
            <div className="relative flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Current mastery</span>
                <span className="font-mono text-primary-bright">42%</span>
              </div>
              <AnimatedBar value={42} label="Current mastery" />
            </div>
            <p className="relative text-sm leading-relaxed text-muted-foreground">
              Your current mastery is 42%. Normalization depends on this concept.
            </p>
            <Button className="relative mt-auto w-full">
              Start Practice
              <ArrowRight />
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
