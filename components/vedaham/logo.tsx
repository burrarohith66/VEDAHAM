import { useId } from "react"
import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF6A00" />
          <stop offset="1" stopColor="#FFB000" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="31" height="31" rx="9" fill="#0d0d0d" stroke="rgba(255,106,0,0.35)" />
      <path
        d="M7.5 10 L14 23 L24.5 7.5"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="10" r="2.2" fill="#FF6A00" />
      <circle cx="14" cy="23" r="2.2" fill="#FF8A00" />
      <circle cx="24.5" cy="7.5" r="2.6" fill="#FFB000" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-lg font-semibold tracking-tight">Vedaham</span>
    </span>
  )
}
