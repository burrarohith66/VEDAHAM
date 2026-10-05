"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  BookOpen,
  Brain,
  ClipboardCheck,
  Dumbbell,
  FileText,
  Gauge,
  Map,
  RefreshCw,
  ScanSearch,
  Sparkles,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Section, SectionHeader } from "./shared"
import { EASE } from "./motion"

const steps: { label: string; icon: LucideIcon }[] = [
  { label: "Your Goal", icon: Target },
  { label: "Your Syllabus / Skills", icon: FileText },
  { label: "Initial Assessment", icon: ClipboardCheck },
  { label: "AI Understands Your Level", icon: Brain },
  { label: "Personalized Roadmap", icon: Map },
  { label: "Learn", icon: BookOpen },
  { label: "Practice", icon: Dumbbell },
  { label: "Quiz", icon: Trophy },
  { label: "Mastery Analysis", icon: Gauge },
  { label: "Identify Gaps", icon: ScanSearch },
  { label: "Next Best Action", icon: Sparkles },
  { label: "Roadmap Adapts", icon: RefreshCw },
]

export function AiLoop() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [reduce])

  return (
    <Section id="how-it-works" glow="left" className="border-y border-white/[0.04] bg-[#080808]">
      <SectionHeader
        eyebrow="How the AI Works"
        title={
          <>
            AI that learns about <span className="text-gradient">your learning.</span>
          </>
        }
        description="Vedaham continuously learns from your learning evidence and adapts your path."
      />

      <ol className="relative mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        <span
          className="absolute bottom-6 left-[27px] top-6 w-px bg-gradient-to-b from-primary/70 via-primary/30 to-primary/70 sm:hidden"
          aria-hidden
        />
        {steps.map((s, i) => {
          const isActive = i === active
          const isPast = i < active
          return (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: EASE }}
              className={cn(
                "relative flex items-center gap-4 rounded-2xl border p-3 transition-all duration-500 sm:flex-col sm:items-start sm:gap-5 sm:p-5",
                isActive
                  ? "border-primary/60 bg-primary/[0.08] shadow-[0_0_40px_-8px_rgba(255,106,0,0.55)]"
                  : "border-white/[0.07] bg-white/[0.02]",
              )}
            >
              <span
                className={cn(
                  "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-xl border transition-all duration-500 sm:size-10",
                  isActive
                    ? "border-transparent bg-brand text-black"
                    : isPast
                      ? "border-primary/40 bg-[#150b04] text-primary-bright"
                      : "border-white/10 bg-[#0d0d0d] text-muted-foreground",
                )}
              >
                <s.icon className="size-4 sm:size-5" aria-hidden />
              </span>
              <div className="flex flex-1 items-center justify-between gap-2 sm:w-full">
                <span className={cn("text-sm font-medium transition-colors", isActive ? "text-foreground" : "text-foreground/80")}>
                  {s.label}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              </div>
            </motion.li>
          )
        })}
      </ol>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative mx-auto mt-10 flex max-w-2xl flex-col items-center gap-3 overflow-hidden rounded-3xl surface-accent p-8 text-center glow-orange"
      >
        <RefreshCw className="size-6 text-primary-bright" aria-hidden />
        <p className="text-balance text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          Your roadmap isn&apos;t fixed.
          <br />
          <span className="text-gradient">It evolves as you learn.</span>
        </p>
      </motion.div>
    </Section>
  )
}
