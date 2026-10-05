"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BookOpen, Check, Sparkles, User } from "lucide-react"
import { Reveal } from "./motion"
import { MonoLabel, Section, SectionHeader, WindowChrome } from "./shared"

const capabilities = [
  "Explain a topic",
  "Give a real-world example",
  "Generate practice questions",
  "Provide hints",
  "Explain mistakes",
  "Adapt to your weak topics",
]

const suggestions: { label: string; reply: string }[] = [
  {
    label: "Explain Simply",
    reply:
      "Think of a JOIN like matching two lists by a shared ID. Each student row finds its matching course row, and the result combines both.",
  },
  {
    label: "Show Example",
    reply:
      "SELECT s.name, c.title FROM students s INNER JOIN courses c ON s.course_id = c.id; returns only students enrolled in an existing course.",
  },
  {
    label: "Give Hint",
    reply: "Hint: ask yourself, should rows without a match still appear? If yes, you likely want a LEFT JOIN.",
  },
  {
    label: "Practice Question",
    reply: "Write a query listing every department and the number of employees in it, including departments with zero employees.",
  },
]

export function AiTutor() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <Section id="ai-tutor" glow="right">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-8">
          <SectionHeader
            align="left"
            eyebrow="AI Tutor"
            title={
              <>
                An AI tutor that knows <span className="text-gradient">what you&apos;re learning.</span>
              </>
            }
            description="Vedaham's AI tutor uses learning context and retrieved study material to give more relevant explanations."
          />
          <Reveal delay={0.1}>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {capabilities.map((c) => (
                <li key={c} className="flex items-center gap-2.5 text-sm text-foreground/85">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary-bright">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="overflow-hidden rounded-3xl surface-accent glow-orange">
          <WindowChrome title="AI Tutor · DBMS / SQL JOIN" />
          <div className="flex flex-col gap-4 p-4 sm:p-6">
            <div className="flex items-start justify-end gap-2.5">
              <p className="max-w-[85%] rounded-2xl rounded-tr-md bg-white/[0.07] px-4 py-3 text-sm">
                Explain SQL JOIN with an example.
              </p>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <User className="size-3.5 text-muted-foreground" aria-hidden />
                <span className="sr-only">Student</span>
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-black">
                <Sparkles className="size-3.5" aria-hidden />
                <span className="sr-only">AI Tutor</span>
              </span>
              <div className="flex max-w-[88%] flex-col gap-3 rounded-2xl rounded-tl-md border border-white/[0.08] bg-black/50 px-4 py-3">
                <span className="flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary-bright">
                  <BookOpen className="size-3" aria-hidden />
                  Based on your DBMS module
                </span>
                <p className="text-sm leading-relaxed text-foreground/90">
                  A JOIN combines rows from two tables using a related column. Since your mastery in JOIN is 42%, let&apos;s
                  start with a simple student-course example.
                </p>
                <pre className="overflow-x-auto rounded-lg border border-white/[0.06] bg-black/60 p-3 font-mono text-[11px] leading-relaxed text-foreground/80">
                  <code>
                    <span className="text-primary-bright">SELECT</span> s.name, c.title{"\n"}
                    <span className="text-primary-bright">FROM</span> students s{"\n"}
                    <span className="text-primary-bright">JOIN</span> courses c{"\n"}
                    {"  "}
                    <span className="text-primary-bright">ON</span> s.course_id = c.id;
                  </code>
                </pre>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selected !== null && (
                <motion.div
                  key={selected}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-2.5"
                  aria-live="polite"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-black">
                    <Sparkles className="size-3.5" aria-hidden />
                  </span>
                  <div className="flex max-w-[88%] flex-col gap-1.5 rounded-2xl rounded-tl-md border border-primary/30 bg-primary/[0.06] px-4 py-3">
                    <MonoLabel className="text-primary-bright">{suggestions[selected].label}</MonoLabel>
                    <p className="text-sm leading-relaxed text-foreground/90">{suggestions[selected].reply}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap gap-2 border-t border-white/[0.06] pt-4" role="group" aria-label="Suggested follow-ups">
              {suggestions.map((s, i) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-pressed={selected === i}
                  className={
                    selected === i
                      ? "rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-black transition-all"
                      : "rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs text-foreground/85 transition-all hover:border-primary/50 hover:text-foreground"
                  }
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
