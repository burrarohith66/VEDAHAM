import { Check, Minus } from "lucide-react"
import { Reveal } from "./motion"
import { Section, SectionHeader } from "./shared"

const traditional = ["Same path for everyone", "Completion-based progress", "Generic AI answers", "Academics and skills separated"]
const vedaham = [
  "Personalized learning paths",
  "Mastery-based progress",
  "Context-aware AI tutor",
  "Academics + skills connected",
  "Skill-gap detection",
  "Career-aligned learning",
]

export function WhyVedaham() {
  return (
    <Section id="why" glow="center">
      <SectionHeader
        eyebrow="Why Vedaham"
        title={
          <>
            Not just another <span className="text-gradient">learning platform.</span>
          </>
        }
      />

      <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
        <Reveal className="flex flex-col gap-6 rounded-3xl surface p-6 md:p-8">
          <h3 className="text-lg font-semibold text-muted-foreground">Traditional Learning</h3>
          <ul className="flex flex-col gap-3">
            {traditional.map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-white/10">
                  <Minus className="size-3" aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="relative flex flex-col gap-6 overflow-hidden rounded-3xl surface-accent p-6 glow-orange md:p-8">
          <span className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/25 blur-3xl" aria-hidden />
          <h3 className="relative text-lg font-semibold">
            <span className="text-gradient">Vedaham</span>
          </h3>
          <ul className="relative flex flex-col gap-3">
            {vedaham.map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm font-medium">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-black">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
