"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronRight, Clock, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container, Eyebrow, MonoLabel, StatusIcon, type NodeStatus } from "./shared"
import { AnimatedBar, EASE } from "./motion"

const topics: { name: string; status: NodeStatus; meta: string }[] = [
  { name: "Fundamentals", status: "done", meta: "Mastered" },
  { name: "ER Model", status: "done", meta: "Mastered" },
  { name: "SQL JOIN", status: "current", meta: "42%" },
  { name: "Normalization", status: "locked", meta: "Locked" },
]

const path = ["DBMS", "SQL", "Backend", "Career"]

const graphNodes = [
  [40, 80],
  [140, 30],
  [250, 110],
  [90, 220],
  [330, 40],
  [380, 200],
  [210, 300],
  [430, 330],
  [60, 380],
  [320, 420],
] as const
const graphEdges = [
  [0, 1],
  [1, 2],
  [0, 3],
  [2, 4],
  [2, 5],
  [3, 6],
  [5, 7],
  [6, 7],
  [3, 8],
  [6, 9],
  [9, 7],
  [1, 4],
] as const

function KnowledgeGraph() {
  return (
    <svg viewBox="0 0 480 460" className="absolute inset-0 size-full" aria-hidden>
      {graphEdges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={graphNodes[a][0]}
          y1={graphNodes[a][1]}
          x2={graphNodes[b][0]}
          y2={graphNodes[b][1]}
          stroke="#FF6A00"
          strokeOpacity={0.28}
          strokeWidth={1}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, delay: 0.4 + i * 0.08, ease: EASE }}
        />
      ))}
      {graphNodes.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i % 3 === 0 ? 4 : 2.5}
          fill={i % 3 === 0 ? "#FFB000" : "#FF6A00"}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, delay: i * 0.25, repeat: Infinity }}
        />
      ))}
    </svg>
  )
}

function HeroDashboard() {
  return (
    <div className="relative overflow-hidden rounded-3xl surface-accent glow-orange backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
        <div className="flex flex-col gap-1">
          <MonoLabel>Roadmap</MonoLabel>
          <p className="text-sm font-semibold sm:text-base">Your Learning Path</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary-bright">
          <span className="size-1.5 animate-pulse rounded-full bg-primary motion-reduce:animate-none" aria-hidden />
          Adapting
        </span>
      </div>

      <div className="flex flex-col gap-5 p-5">
        <ol className="flex flex-wrap items-center gap-1.5" aria-label="Career path">
          {path.map((p, i) => (
            <li key={p} className="flex items-center gap-1.5">
              <span
                className={
                  i <= 1
                    ? "rounded-md border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[11px] text-primary-bright"
                    : "rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-muted-foreground"
                }
              >
                {p}
              </span>
              {i < path.length - 1 && <ChevronRight className="size-3 text-muted-foreground/60" aria-hidden />}
            </li>
          ))}
        </ol>

        <ul className="relative flex flex-col gap-1">
          <span className="absolute bottom-4 left-[11px] top-4 w-px bg-gradient-to-b from-primary/60 via-primary/30 to-white/10" aria-hidden />
          {topics.map((t) => (
            <li
              key={t.name}
              className={
                t.status === "current"
                  ? "relative flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/[0.07] -mx-2 px-2 py-2.5"
                  : "relative flex items-center gap-3 py-2.5 pr-3"
              }
            >
              <StatusIcon status={t.status} />
              <span className={t.status === "locked" ? "flex-1 text-sm text-muted-foreground" : "flex-1 text-sm font-medium"}>
                {t.name}
              </span>
              <span
                className={
                  t.status === "current" ? "font-mono text-xs text-primary-bright" : "font-mono text-[11px] text-muted-foreground"
                }
              >
                {t.meta}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-black/40 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary-bright">
              <Sparkles className="size-3" aria-hidden />
              Next Best Action
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="size-3" aria-hidden />
              20 min
            </span>
          </div>
          <p className="text-base font-semibold">Practice SQL JOIN</p>
          <AnimatedBar value={42} delay={0.6} label="SQL JOIN mastery" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-foreground/90">Why?</span>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your mastery is 42% and this topic is a prerequisite for Normalization.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 140])

  return (
    <section ref={ref} id="home" className="relative overflow-hidden pb-20 pt-28 md:pb-28 md:pt-36">
      <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" aria-hidden />
      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute -top-40 right-[-20%] size-[560px] rounded-full bg-primary/20 blur-[140px] md:right-[-5%] md:size-[760px]"
        aria-hidden
      />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="flex flex-col items-start gap-7">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <Eyebrow>AI-Powered Personalized Learning</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="text-[2.35rem] font-semibold leading-[1.02] tracking-tighter sm:text-6xl lg:text-7xl"
          >
            Learn <span className="text-gradient">Smarter.</span>
            <br />
            Build Skills.
            <br />
            Become <span className="text-gradient">Career Ready.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Vedaham adapts your learning journey to what you know, what you need to improve, and where you want to go.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <Button size="lg" className="w-full sm:w-auto" asChild><Link href="/register">Start Learning<ArrowRight /></Link></Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span className="h-px w-6 bg-primary/60" aria-hidden />
            One platform for academics, skills, mastery and career readiness.
          </motion.p>
        </div>

        <motion.div
          style={{ y: visualY }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="pointer-events-none absolute -inset-10 opacity-80 md:-inset-16">
            <KnowledgeGraph />
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <HeroDashboard />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
