"use client"

import { useEffect, useState } from "react"
import { Award, Flame, Pause, Play, RotateCcw, Star, Target, Timer, Zap, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedBar, Reveal } from "./motion"
import { MonoLabel, Section, SectionHeader } from "./shared"

const FOCUS_SECONDS = 25 * 60

function Pomodoro() {
  const [remaining, setRemaining] = useState(FOCUS_SECONDS)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0")
  const ss = String(remaining % 60).padStart(2, "0")
  const pct = ((FOCUS_SECONDS - remaining) / FOCUS_SECONDS) * 100

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-2">
        <span className="font-mono text-4xl font-semibold tabular-nums tracking-tight" aria-live="off">
          {mm}:{ss}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            aria-label={running ? "Pause focus timer" : "Start focus timer"}
            className="flex size-10 items-center justify-center rounded-full bg-brand text-black transition hover:brightness-110"
          >
            {running ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setRunning(false)
              setRemaining(FOCUS_SECONDS)
            }}
            aria-label="Reset focus timer"
            className="flex size-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-muted-foreground transition hover:text-foreground"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full bg-brand transition-[width] duration-1000 ease-linear" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

const badges: { label: string; icon: LucideIcon; earned: boolean }[] = [
  { label: "SQL Starter", icon: Star, earned: true },
  { label: "7-Day Streak", icon: Flame, earned: true },
  { label: "JOIN Master", icon: Award, earned: false },
]

const week = [true, true, true, true, true, true, true]

export function Engagement() {
  return (
    <Section id="engagement" className="border-y border-white/[0.04] bg-[#080808]">
      <SectionHeader
        eyebrow="Consistency"
        title={
          <>
            Stay consistent. <span className="text-gradient">Keep improving.</span>
          </>
        }
        description="Gamification supports consistency without replacing real learning."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal className="flex flex-col gap-5 rounded-3xl surface-accent p-6">
          <div className="flex items-center justify-between">
            <MonoLabel>Learning Streak</MonoLabel>
            <Flame className="size-5 text-primary-bright" aria-hidden />
          </div>
          <p className="text-4xl font-semibold tracking-tight">
            7 <span className="text-base font-medium text-muted-foreground">days</span>
          </p>
          <ul className="flex gap-1.5" aria-label="Last 7 days, all active">
            {week.map((on, i) => (
              <li key={i} className={cn("h-7 flex-1 rounded-md", on ? "bg-brand" : "bg-white/[0.06]")} />
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.06} className="flex flex-col gap-5 rounded-3xl surface p-6">
          <div className="flex items-center justify-between">
            <MonoLabel>XP · Level 4</MonoLabel>
            <Zap className="size-5 text-primary-bright" aria-hidden />
          </div>
          <p className="text-4xl font-semibold tracking-tight">
            1,240 <span className="text-base font-medium text-muted-foreground">XP</span>
          </p>
          <div className="flex flex-col gap-2">
            <AnimatedBar value={62} label="Progress to level 5" />
            <span className="text-xs text-muted-foreground">760 XP to Level 5</span>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="flex flex-col gap-5 rounded-3xl surface p-6">
          <div className="flex items-center justify-between">
            <MonoLabel>Badges</MonoLabel>
            <Target className="size-5 text-primary-bright" aria-hidden />
          </div>
          <ul className="flex flex-col gap-2">
            {badges.map((b) => (
              <li
                key={b.label}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2",
                  b.earned ? "border-primary/30 bg-primary/[0.06]" : "border-dashed border-white/10 opacity-60",
                )}
              >
                <b.icon className={cn("size-4", b.earned ? "text-primary-bright" : "text-muted-foreground")} aria-hidden />
                <span className="text-sm">{b.label}</span>
                {!b.earned && <span className="ml-auto font-mono text-[10px] text-muted-foreground">Locked</span>}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.18} className="flex flex-col gap-5 rounded-3xl surface p-6">
          <div className="flex items-center justify-between">
            <MonoLabel>Focus Session</MonoLabel>
            <Timer className="size-5 text-primary-bright" aria-hidden />
          </div>
          <Pomodoro />
          <div className="mt-auto flex flex-col gap-2 border-t border-white/[0.06] pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Daily goal</span>
              <span className="font-mono text-primary-bright">2 / 3 sessions</span>
            </div>
            <AnimatedBar value={66} className="h-1.5" label="Daily goal progress" />
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
