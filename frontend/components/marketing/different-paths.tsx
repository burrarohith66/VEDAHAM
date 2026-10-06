import { Shuffle } from "lucide-react"
import { Reveal } from "./motion"
import { MonoLabel, Section, SectionHeader, StatusIcon, type NodeStatus } from "./shared"

const topics = ["Fundamentals", "ER Model", "Relational Model", "SQL", "Normalization"]
const studentA: NodeStatus[] = ["done", "done", "done", "current", "locked"]
const studentB: NodeStatus[] = ["done", "current", "locked", "locked", "locked"]

function StudentPath({ name, statuses }: { name: string; statuses: NodeStatus[] }) {
  return (
    <div className="flex h-full flex-col gap-5 rounded-3xl surface p-6">
      <div className="flex items-center justify-between">
        <MonoLabel className="text-foreground">{name}</MonoLabel>
        <span className="font-mono text-[11px] text-muted-foreground">DBMS</span>
      </div>
      <ul className="relative flex flex-col gap-4">
        <span className="absolute bottom-3 left-[11px] top-3 w-px bg-white/10" aria-hidden />
        {topics.map((t, i) => (
          <li key={t} className="relative flex items-center gap-3">
            <StatusIcon status={statuses[i]} />
            <span
              className={
                statuses[i] === "current"
                  ? "text-sm font-semibold text-primary-bright"
                  : statuses[i] === "locked"
                    ? "text-sm text-muted-foreground"
                    : "text-sm"
              }
            >
              {t}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DifferentPaths() {
  return (
    <Section id="paths" glow="center">
      <SectionHeader
        eyebrow="Adaptive Routing"
        title={
          <>
            Same syllabus.
            <br />
            <span className="text-gradient">Different learning paths.</span>
          </>
        }
      />

      <div className="mt-14 grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
        <Reveal className="h-full">
          <StudentPath name="Student A" statuses={studentA} />
        </Reveal>

        <Reveal delay={0.1} className="flex justify-center">
          <div className="flex max-w-[240px] flex-col items-center gap-3 rounded-3xl surface-accent p-6 text-center glow-orange">
            <span className="flex size-11 items-center justify-center rounded-full bg-brand text-black">
              <Shuffle className="size-5" aria-hidden />
            </span>
            <p className="text-sm font-medium leading-relaxed">
              Vedaham adapts the route based on <span className="text-primary-bright">demonstrated mastery.</span>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="h-full">
          <StudentPath name="Student B" statuses={studentB} />
        </Reveal>
      </div>
    </Section>
  )
}
