import { Check, GraduationCap, Route, Sparkles, type LucideIcon } from "lucide-react"
import { Reveal } from "./motion"
import { Section, SectionHeader } from "./shared"

const pillars: { label: string; icon: LucideIcon; text: string; features: string[]; href: string }[] = [
  {
    label: "Academics",
    icon: GraduationCap,
    text: "Turn your syllabus into an adaptive learning roadmap.",
    features: [
      "AI syllabus analysis",
      "Topic and subtopic mapping",
      "Personalized learning path",
      "Mastery tracking",
      "Weak-topic detection",
      "Smart revision",
    ],
    href: "#academics",
  },
  {
    label: "Skills",
    icon: Route,
    text: "Build the skills your target career actually needs.",
    features: [
      "Career goal selection",
      "Skill assessment",
      "Interactive skill roadmap",
      "Industry skill analysis",
      "Skill-gap detection",
      "Project-based learning",
    ],
    href: "#skills",
  },
  {
    label: "AI Tutor",
    icon: Sparkles,
    text: "Get explanations based on what you're learning and where you're struggling.",
    features: [
      "Context-aware explanations",
      "RAG-powered answers",
      "Examples",
      "Hints",
      "Practice questions",
      "Personalized feedback",
    ],
    href: "#ai-tutor",
  },
]

export function Solution() {
  return (
    <Section id="solution" glow="center">
      <SectionHeader
        eyebrow="The Solution"
        title={
          <>
            One platform.
            <br />
            <span className="text-gradient">A learning journey built around you.</span>
          </>
        }
      />

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.label} delay={i * 0.08}>
            <a
              href={p.href}
              className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl surface p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_rgba(255,106,0,0.45)] md:p-7"
            >
              <span
                className="absolute -right-16 -top-16 size-40 rounded-full bg-primary/0 blur-3xl transition-colors duration-500 group-hover:bg-primary/25"
                aria-hidden
              />
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-brand text-black shadow-[0_8px_30px_-6px_rgba(255,106,0,0.6)]">
                  <p.icon className="size-6" aria-hidden />
                </span>
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary-bright">{p.label}</h3>
                <p className="text-pretty text-xl font-semibold leading-snug tracking-tight">{p.text}</p>
              </div>
              <ul className="mt-auto flex flex-col gap-2.5 border-t border-white/[0.06] pt-5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check className="size-4 shrink-0 text-primary" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
