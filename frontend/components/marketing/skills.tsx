import {
  ArrowRight,
  BarChart3,
  Brain,
  ChevronDown,
  Code2,
  Layout,
  Server,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import { Reveal } from "./motion"
import { MonoLabel, Section, SectionHeader, StatusIcon, type NodeStatus } from "./shared"

const careers: { name: string; icon: LucideIcon }[] = [
  { name: "Frontend Developer", icon: Layout },
  { name: "Backend Developer", icon: Server },
  { name: "Full Stack Developer", icon: Code2 },
  { name: "Data Analyst", icon: BarChart3 },
  { name: "AI / ML Engineer", icon: Brain },
  { name: "Cybersecurity", icon: ShieldCheck },
]

const journey = [
  "Choose Career",
  "Skill Assessment",
  "Current Skill Level",
  "Skill-Gap Detection",
  "Personalized Roadmap",
  "Learn & Practice",
  "Build Projects",
  "Career Readiness",
]

const graph: { name: string; status: NodeStatus }[] = [
  { name: "JavaScript", status: "done" },
  { name: "React", status: "current" },
  { name: "Frontend", status: "locked" },
  { name: "Projects", status: "locked" },
  { name: "Frontend Developer", status: "locked" },
]

export function Skills() {
  return (
    <Section id="skills" glow="right" className="border-y border-white/[0.04] bg-[#080808]">
      <SectionHeader
        eyebrow="Skills"
        title={
          <>
            Choose your goal.
            <br />
            <span className="text-gradient">Build the skills to reach it.</span>
          </>
        }
        description="Select a career path and Vedaham creates a personalized roadmap based on your current skills and target role."
      />

      <ul className="-mx-5 mt-14 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
        {careers.map((c, i) => (
          <Reveal
            as="li"
            key={c.name}
            delay={i * 0.05}
            className="group flex w-[150px] shrink-0 snap-start flex-col gap-6 rounded-2xl surface p-4 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 sm:w-auto"
          >
            <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-primary-bright transition-colors group-hover:border-transparent group-hover:bg-brand group-hover:text-black">
              <c.icon className="size-5" aria-hidden />
            </span>
            <span className="text-sm font-medium leading-snug">{c.name}</span>
          </Reveal>
        ))}
      </ul>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="flex flex-col gap-6 rounded-3xl surface p-6 md:p-8">
          <MonoLabel>Skill Journey</MonoLabel>
          <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            {journey.map((j, i) => (
              <li key={j} className="flex items-center gap-2 sm:gap-2">
                <span
                  className={
                    i === journey.length - 1
                      ? "flex items-center gap-2 rounded-full bg-brand px-3.5 py-2 text-sm font-semibold text-black"
                      : "flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm"
                  }
                >
                  <span className={i === journey.length - 1 ? "font-mono text-[10px]" : "font-mono text-[10px] text-primary-bright"}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {j}
                </span>
                {i < journey.length - 1 && <ArrowRight className="hidden size-3.5 text-muted-foreground/50 sm:block" aria-hidden />}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-5 rounded-3xl surface-accent p-6 md:p-8">
          <div className="flex items-center justify-between">
            <MonoLabel>Skill Graph</MonoLabel>
            <span className="font-mono text-[11px] text-primary-bright">Frontend Path</span>
          </div>
          <ol className="flex flex-col items-start">
            {graph.map((g, i) => (
              <li key={g.name} className="flex flex-col items-start">
                <div
                  className={
                    g.status === "current"
                      ? "flex items-center gap-3 rounded-xl border border-primary/50 bg-primary/[0.1] px-3 py-2 shadow-[0_0_30px_-6px_rgba(255,106,0,0.6)]"
                      : i === graph.length - 1
                        ? "flex items-center gap-3 rounded-xl border border-dashed border-primary/30 px-3 py-2"
                        : "flex items-center gap-3 px-3 py-2"
                  }
                >
                  <StatusIcon status={g.status} />
                  <span className={g.status === "locked" ? "text-sm text-muted-foreground" : "text-sm font-medium"}>{g.name}</span>
                </div>
                {i < graph.length - 1 && <ChevronDown className="ml-[18px] size-4 text-primary/50" aria-hidden />}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  )
}
