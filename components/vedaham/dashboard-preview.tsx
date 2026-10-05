import {
  ArrowRight,
  BookOpen,
  Calendar,
  Flame,
  GraduationCap,
  LayoutDashboard,
  Route,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatedBar, Reveal } from "./motion"
import { MonoLabel, Section, SectionHeader, WindowChrome } from "./shared"
import { LogoMark } from "./logo"

const nav: { label: string; icon: LucideIcon; active?: boolean }[] = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Academics", icon: GraduationCap },
  { label: "Skills", icon: Route },
  { label: "AI Tutor", icon: Sparkles },
  { label: "Revision", icon: Calendar },
]

const weak = ["SQL JOIN", "Normalization"]
const strong = ["ER Model", "SELECT Queries"]

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-black/40 p-4", className)}>{children}</div>
}

export function DashboardPreview() {
  return (
    <Section id="dashboard" glow="center">
      <SectionHeader
        eyebrow="Student Dashboard"
        title={
          <>
            Your learning journey, <span className="text-gradient">in one place.</span>
          </>
        }
      />

      <Reveal className="mt-14 overflow-hidden rounded-3xl surface-accent glow-orange">
        <WindowChrome title="app.vedaham / dashboard" />
        <div className="flex">
          <aside className="hidden w-52 shrink-0 flex-col gap-1 border-r border-white/[0.06] p-4 md:flex" aria-label="Dashboard navigation preview">
            <div className="mb-4 flex items-center gap-2 px-2">
              <LogoMark className="size-6" />
              <span className="text-sm font-semibold">Vedaham</span>
            </div>
            {nav.map((n) => (
              <span
                key={n.label}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm",
                  n.active ? "bg-primary/10 text-primary-bright" : "text-muted-foreground",
                )}
              >
                <n.icon className="size-4" aria-hidden />
                {n.label}
              </span>
            ))}
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 md:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="flex flex-col gap-1">
                <MonoLabel>Thursday</MonoLabel>
                <p className="text-xl font-semibold tracking-tight md:text-2xl">Good morning, Aarav</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-bright">
                <Flame className="size-3.5" aria-hidden />
                7-day streak
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Panel className="lg:col-span-2">
                <MonoLabel>Today&apos;s Plan</MonoLabel>
                <ul className="flex flex-col gap-2">
                  {[
                    { t: "SQL JOIN Practice", d: "20 min" },
                    { t: "React Components", d: "15 min" },
                  ].map((x, i) => (
                    <li
                      key={x.t}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-3 py-2.5",
                        i === 0 ? "border-primary/30 bg-primary/[0.06]" : "border-white/[0.06]",
                      )}
                    >
                      <BookOpen className="size-4 shrink-0 text-primary-bright" aria-hidden />
                      <span className="min-w-0 flex-1 truncate text-sm">{x.t}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{x.d}</span>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel className="border-primary/30 bg-primary/[0.06]">
                <MonoLabel className="text-primary-bright">Next Best Action</MonoLabel>
                <p className="text-base font-semibold">Practice SQL JOIN</p>
                <Button size="sm" className="mt-auto w-full">
                  Start
                  <ArrowRight />
                </Button>
              </Panel>

              <Panel>
                <div className="flex items-center justify-between">
                  <MonoLabel>Academic Progress</MonoLabel>
                  <span className="font-mono text-xs text-primary-bright">68%</span>
                </div>
                <span className="text-sm">DBMS</span>
                <AnimatedBar value={68} label="DBMS progress" />
              </Panel>

              <Panel>
                <div className="flex items-center justify-between">
                  <MonoLabel>Skill Progress</MonoLabel>
                  <span className="font-mono text-xs text-primary-bright">54%</span>
                </div>
                <span className="text-sm">Frontend Developer</span>
                <AnimatedBar value={54} delay={0.1} label="Frontend Developer progress" />
              </Panel>

              <Panel>
                <MonoLabel>Topics</MonoLabel>
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] text-muted-foreground">Weak</span>
                  <div className="flex flex-wrap gap-1.5">
                    {weak.map((w) => (
                      <span key={w} className="rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs text-primary-bright">
                        {w}
                      </span>
                    ))}
                  </div>
                  <span className="mt-1 text-[11px] text-muted-foreground">Strong</span>
                  <div className="flex flex-wrap gap-1.5">
                    {strong.map((w) => (
                      <span key={w} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
