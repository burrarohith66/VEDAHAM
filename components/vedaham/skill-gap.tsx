import { Crosshair } from "lucide-react"
import { AnimatedBar, Reveal } from "./motion"
import { IllustrativeTag, MonoLabel, Section, SectionHeader } from "./shared"

const skills = [
  { name: "HTML", value: 90 },
  { name: "CSS", value: 75 },
  { name: "JavaScript", value: 60 },
  { name: "React", value: 30 },
  { name: "Git", value: 20 },
  { name: "Testing", value: 10 },
]
const priorities = ["React", "Git", "Testing"]

export function SkillGap() {
  return (
    <Section id="skill-gap">
      <SectionHeader
        eyebrow="Skill-Gap Detection"
        title={
          <>
            Know what you have.
            <br />
            <span className="text-gradient">Know what&apos;s missing.</span>
          </>
        }
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Reveal className="flex flex-col gap-6 rounded-3xl surface p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              <MonoLabel>Target Role</MonoLabel>
              <p className="text-lg font-semibold">Frontend Developer</p>
            </div>
            <IllustrativeTag />
          </div>
          <ul className="flex flex-col gap-4">
            {skills.map((s, i) => (
              <li key={s.name} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={s.value < 40 ? "font-medium text-foreground" : "text-foreground/80"}>{s.name}</span>
                  <span className={s.value < 40 ? "font-mono text-xs text-primary-bright" : "font-mono text-xs text-muted-foreground"}>
                    {s.value}%
                  </span>
                </div>
                <AnimatedBar value={s.value} delay={i * 0.08} label={`${s.name} skill level`} />
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-6 rounded-3xl surface-accent p-6 glow-orange md:p-8">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-brand text-black">
            <Crosshair className="size-5" aria-hidden />
          </span>
          <h3 className="text-xl font-semibold tracking-tight">Recommended Priority</h3>
          <ol className="flex flex-col gap-2">
            {priorities.map((p, i) => (
              <li key={p} className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3">
                <span className="font-mono text-xs text-primary-bright">{i + 1}.</span>
                <span className="text-sm font-medium">{p}</span>
              </li>
            ))}
          </ol>
          <p className="mt-auto text-sm leading-relaxed text-muted-foreground">
            Vedaham prioritizes the skills that matter most for your selected goal.
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
