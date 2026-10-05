import { ArrowUpRight } from "lucide-react"
import { Logo } from "./logo"
import { Container } from "./shared"

const product = [
  { label: "Academics", href: "#academics" },
  { label: "Skills", href: "#skills" },
  { label: "AI Tutor", href: "#ai-tutor" },
  { label: "How It Works", href: "#how-it-works" },
]
const company = [
  { label: "About", href: "#why" },
  { label: "Contact", href: "mailto:hello@vedaham.app" },
]
const social = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-14">
      <Container className="flex flex-col gap-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Learn Smarter. Build Skills. Become Career Ready.
            </p>
          </div>
          <FooterCol title="Product" links={product} />
          <FooterCol title="Company" links={company} />
          <FooterCol title="Connect" links={social} external />
        </div>
        <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Vedaham. All rights reserved.</span>
          <span className="font-mono">Adaptive learning, built around you.</span>
        </div>
      </Container>
    </footer>
  )
}

function FooterCol({ title, links, external }: { title: string; links: { label: string; href: string }[]; external?: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{title}</h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-primary-bright"
            >
              {l.label}
              {external && <ArrowUpRight className="size-3.5" aria-hidden />}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
