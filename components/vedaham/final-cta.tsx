import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "./motion"
import { Container } from "./shared"

export function FinalCta() {
  return (
    <section id="get-started" className="relative py-20 md:py-28">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[2rem] border border-primary/30 px-6 py-16 text-center md:px-12 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,106,0,0.32),rgba(5,5,5,0)_65%)]" aria-hidden />
          <div className="absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
            <h2 className="text-balance text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Stop following the same path as everyone else.
            </h2>
            <p className="text-balance text-lg text-foreground/80 md:text-xl">
              <span className="text-gradient font-semibold">Start learning the way you learn best.</span>
            </p>
            <Button size="lg" className="mt-2 w-full sm:w-auto">
              Start Your Journey
              <ArrowRight />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
