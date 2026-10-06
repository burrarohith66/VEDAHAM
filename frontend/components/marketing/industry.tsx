import { Briefcase, Cpu, Filter, Layers, ListOrdered, Network, RefreshCw, type LucideIcon } from "lucide-react"
import { AnimatedBar, Reveal } from "./motion"
import { IllustrativeTag, MonoLabel, Section, SectionHeader } from "./shared"

const pipeline: { label: string; icon: LucideIcon }[] = [
  { label: "Job Descriptions", icon: Briefcase },
  { label: "Skill Extraction", icon: Filter },
  { label: "Skill Normalization", icon: Layers },
  { label: "Skill Taxonomy", icon: Network },
  { label: "Skill Weighting", icon: Cpu },
  { label: "Career Priorities", icon: ListOrdered },
  { label: "Roadmap Updates", icon: RefreshCw },
]

const signals = [
  { name: "JavaScript", weight: 92 },
  { name: "React", weight: 85 },
  { name: "Git", weight: 70 },
  { name: "REST APIs", weight: 62 },
  { name: "Testing", weight: 48 },
]

export function Industry() {
  return (
    <Section id="industry" glow="left" className="border-y border-white/[0.04] bg-[#080808]">
      <SectionHeader
        eyebrow="Industry Intelligence"
        title={
          <>
            Learn skills that are <span className="text-gradient">relevant to real jobs.</span>
          </>
        }
        description="Vedaham can analyze job descriptions and identify the skills most frequently requested for specific roles."
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Reveal className="rounded-3xl surface p-6 md:p-8">
          <MonoLabel>Analysis Pipeline</MonoLabel>
          <ol className="relative mt-6 flex flex-col gap-3">
            <span className="absolute bottom-5 left-[19px] top-5 w-px bg-gradient-to-b from-primary/70 to-primary/10" aria-hidden />
            {pipeline.map((p, i) => (
              <li key={p.label} className="relative flex items-center gap-4">
                <span
                  className={
                    i === pipeline.length - 1
                      ? "flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-black"
                      : "flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0f0f0f] text-primary-bright"
                  }
                >
                  <p.icon className="size-4" aria-hidden />
                </span>
                <span className="text-sm font-medium">{p.label}</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-6 rounded-3xl surface-accent p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              <MonoLabel>Example</MonoLabel>
              <p className="text-lg font-semibold">Frontend Developer</p>
            </div>
            <IllustrativeTag />
          </div>
          <p className="text-sm text-muted-foreground">Most frequently requested skills</p>
          <ul className="flex flex-col gap-4">
            {signals.map((s, i) => (
              <li key={s.name} className="flex flex-col gap-2">
                <span className="text-sm">{s.name}</span>
                <AnimatedBar value={s.weight} delay={i * 0.08} label={`${s.name} relative demand`} showValue={false} />
              </li>
            ))}
          </ul>
          <p className="mt-auto rounded-xl border border-white/[0.08] bg-black/40 p-4 text-xs leading-relaxed text-muted-foreground">
            Insights depend on the job dataset analyzed. Bars show relative frequency, not real market statistics.
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
