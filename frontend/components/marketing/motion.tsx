"use client"

import { motion, MotionConfig } from "framer-motion"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export const EASE = [0.22, 1, 0.36, 1] as const

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
  as = "div",
}: {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
  as?: "div" | "li"
}) {
  const Comp = as === "li" ? motion.li : motion.div
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Comp>
  )
}

export function AnimatedBar({
  value,
  delay = 0,
  className,
  label,
  showValue = true,
}: {
  value: number
  delay?: number
  className?: string
  label?: string
  showValue?: boolean
}) {
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-white/[0.06]", className)}
      role="progressbar"
      aria-label={label}
      aria-valuenow={showValue ? value : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full bg-brand shadow-[0_0_12px_rgba(255,106,0,0.6)]"
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.2, delay, ease: EASE }}
      />
    </div>
  )
}
