"use client"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SETTINGS_SECTIONS,
  type SettingsSectionId,
} from "./settings-types"

type SettingsNavigationProps = {
  activeSection: SettingsSectionId
  onSelectSection: (section: SettingsSectionId) => void
}

export function SettingsNavigation({
  activeSection,
  onSelectSection,
}: SettingsNavigationProps) {
  return (
    <nav
      aria-label="Settings sections"
      className="w-full"
    >
      {/* Desktop / Tablet horizontal tab pills */}
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-black/40 p-1.5 backdrop-blur-md overflow-x-auto no-scrollbar"
      >
        {SETTINGS_SECTIONS.map((section) => {
          const isActive = activeSection === section.id
          const Icon = section.icon

          return (
            <button
              key={section.id}
              role="tab"
              id={`tab-${section.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${section.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectSection(section.id)}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-primary select-none whitespace-nowrap min-h-[44px]",
                isActive
                  ? "bg-primary/15 text-primary-bright shadow-[0_0_15px_rgba(255,106,0,0.25)] border border-primary/30 font-semibold"
                  : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "size-4 transition-colors shrink-0",
                  isActive ? "text-primary-bright" : "text-muted-foreground group-hover:text-foreground"
                )}
                aria-hidden="true"
              />
              <span>{section.label}</span>
              {isActive && (
                <span
                  className="size-1.5 rounded-full bg-primary-bright shadow-[0_0_6px_#ff6a00]"
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Mobile stacked list navigation */}
      <div
        role="tablist"
        aria-orientation="vertical"
        className="flex sm:hidden flex-col gap-2 rounded-2xl border border-white/[0.08] bg-black/40 p-2 backdrop-blur-md"
      >
        {SETTINGS_SECTIONS.map((section) => {
          const isActive = activeSection === section.id
          const Icon = section.icon

          return (
            <button
              key={section.id}
              role="tab"
              id={`tab-mobile-${section.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${section.id}`}
              onClick={() => onSelectSection(section.id)}
              className={cn(
                "group flex w-full items-center justify-between rounded-xl p-3 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-primary select-none min-h-[48px]",
                isActive
                  ? "bg-primary/15 text-primary-bright border border-primary/30 shadow-[0_0_15px_rgba(255,106,0,0.2)] font-semibold"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground border border-transparent"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
                    isActive
                      ? "border-primary/40 bg-primary/20 text-primary-bright"
                      : "border-white/[0.08] bg-white/[0.03] text-muted-foreground"
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium leading-none text-foreground">
                    {section.label}
                  </div>
                  <div className="mt-1 truncate text-xs text-muted-foreground/80">
                    {section.description}
                  </div>
                </div>
              </div>
              <ChevronRight
                className={cn(
                  "size-4 shrink-0 transition-transform",
                  isActive ? "text-primary-bright translate-x-0.5" : "text-muted-foreground/50 group-hover:text-muted-foreground"
                )}
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
