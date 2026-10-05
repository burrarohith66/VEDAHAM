import { ArrowDown, ArrowRight } from "lucide-react"
import { Fragment } from "react"
import { Reveal } from "./motion"
import { Section, SectionHeader } from "./shared"

const tracks = [
  ["DBMS", "SQL", "Backend Development", "Backend Developer"],
  ["Operating Systems", "Linux", "DevOps", "Cloud Engineer"],
  ["Data Structures", "Algorithms", "Coding Interviews", "Software Engineer"],
]

export function AcademicsToCareer() {
  return (
    <Section id="career" className="border-y border-white/[0.04] bg-[#080808]">
      <SectionHeader
        eyebrow="Academics → Career"
        title={
          <>
            Connect what you study <span className="text-gradient">to what you want to become.</span>
          </>
        }
      />

      <div className="mt-14 flex flex-col gap-4">
        {tracks.map((t, ti) => (
          <Reveal key={t[0]} delay={ti * 0.08}>
            <ol className="flex flex-col items-stretch gap-2 rounded-3xl surface p-4 transition-colors duration-500 hover:border-primary/30 md:flex-row md:items-center md:gap-3 md:p-5">
              {t.map((step, i) => {
                const last = i === t.length - 1
                return (
                  <Fragment key={step}>
                    <li
                      className={
                        last
                          ? "rounded-2xl bg-brand px-4 py-3 text-center text-sm font-semibold text-black md:flex-1"
                          : i === 0
                            ? "rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-medium md:flex-1"
                            : "rounded-2xl border border-primary/25 bg-primary/[0.05] px-4 py-3 text-center text-sm md:flex-1"
                      }
                    >
                      {step}
                    </li>
                    {!last && (
                      <li aria-hidden className="flex justify-center text-primary/60">
                        <ArrowDown className="size-4 md:hidden" />
                        <ArrowRight className="hidden size-4 md:block" />
                      </li>
                    )}
                  </Fragment>
                )
              })}
            </ol>
          </Reveal>
        ))}
      </div>

      <Reveal className="mx-auto mt-10 max-w-2xl text-center">
        <p className="text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Vedaham helps you see <span className="text-foreground">why your academic topics matter</span> beyond exams.
        </p>
      </Reveal>
    </Section>
  )
}
