import { ArrowDown, ArrowRight, Users } from "lucide-react"
import { Reveal } from "./motion"
import { Section, SectionHeader } from "./shared"

const learners = [
  { name: "Student A", need: "understands quickly" },
  { name: "Student B", need: "needs examples" },
  { name: "Student C", need: "has prerequisite gaps" },
  { name: "Student D", need: "needs more practice" },
]

const academicFlow = ["College", "Syllabus", "Academic Knowledge"]
const industryFlow = ["Industry Skills", "Projects", "Career"]

function FlowStep({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <div
      className={
        muted
          ? "w-full max-w-[220px] rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-center text-sm text-muted-foreground"
          : "w-full max-w-[220px] rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-center text-sm font-medium"
      }
    >
      {label}
    </div>
  )
}

export function Problem() {
  return (
    <Section id="problem">
      <SectionHeader
        eyebrow="The Problem"
        title={
          <>
            Every student learns differently.
            <br className="hidden sm:block" />{" "}
            <span className="text-muted-foreground">So why does everyone follow the same path?</span>
          </>
        }
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        <Reveal className="flex flex-col gap-6 rounded-3xl surface p-6 transition-colors duration-500 hover:border-primary/30 md:p-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <Users className="size-5 text-primary-bright" aria-hidden />
            </span>
            <h3 className="text-xl font-semibold tracking-tight">One Classroom. Different Learners.</h3>
          </div>

          <ul className="flex flex-col gap-2">
            {learners.map((l) => (
              <li
                key={l.name}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-white/[0.06] bg-black/30 px-4 py-3"
              >
                <span className="font-mono text-xs text-primary-bright">{l.name}</span>
                <ArrowRight className="size-3.5 text-muted-foreground/60" aria-hidden />
                <span className="text-sm text-foreground/90">{l.need}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-dashed border-white/15 p-5 text-center">
            <p className="text-lg font-semibold leading-snug tracking-tight text-foreground/80">
              Same topic.
              <br />
              Same pace.
              <br />
              Same path.
            </p>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            Traditional learning often treats different learners as if they have the same starting point and learning needs.
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="flex flex-col gap-6 rounded-3xl surface p-6 transition-colors duration-500 hover:border-primary/30 md:p-8"
        >
          <h3 className="text-xl font-semibold tracking-tight">
            Academic Knowledge <span className="text-primary-bright">{"≠"}</span> Industry Readiness
          </h3>

          <div className="flex flex-1 flex-col items-center gap-2 py-2">
            {academicFlow.map((s, i) => (
              <div key={s} className="flex w-full flex-col items-center gap-2">
                <FlowStep label={s} />
                {i < academicFlow.length - 1 && <ArrowDown className="size-4 text-muted-foreground/50" aria-hidden />}
              </div>
            ))}

            <div className="relative my-3 flex w-full items-center justify-center" aria-label="Gap between academics and industry">
              <span className="absolute inset-x-0 top-1/2 h-px bg-[repeating-linear-gradient(90deg,rgba(255,106,0,0.6)_0_6px,transparent_6px_12px)]" aria-hidden />
              <span className="relative rounded-full border border-primary/50 bg-background px-4 py-1.5 font-mono text-xs font-semibold tracking-[0.3em] text-primary-bright shadow-[0_0_24px_rgba(255,106,0,0.35)]">
                GAP
              </span>
            </div>

            {industryFlow.map((s, i) => (
              <div key={s} className="flex w-full flex-col items-center gap-2">
                <FlowStep label={s} muted />
                {i < industryFlow.length - 1 && <ArrowDown className="size-4 text-muted-foreground/40" aria-hidden />}
              </div>
            ))}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            Students need more than academic completion. They need practical, demonstrable skills aligned with their career goals.
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
