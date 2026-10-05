import { Navbar } from "@/components/vedaham/navbar"
import { Hero } from "@/components/vedaham/hero"
import { Problem } from "@/components/vedaham/problem"
import { Solution } from "@/components/vedaham/solution"
import { AiLoop } from "@/components/vedaham/ai-loop"
import { Academics } from "@/components/vedaham/academics"
import { DifferentPaths } from "@/components/vedaham/different-paths"
import { Skills } from "@/components/vedaham/skills"
import { SkillGap } from "@/components/vedaham/skill-gap"
import { Industry } from "@/components/vedaham/industry"
import { AiTutor } from "@/components/vedaham/ai-tutor"
import { Mastery } from "@/components/vedaham/mastery"
import { Revision } from "@/components/vedaham/revision"
import { AcademicsToCareer } from "@/components/vedaham/academics-to-career"
import { DashboardPreview } from "@/components/vedaham/dashboard-preview"
import { Engagement } from "@/components/vedaham/engagement"
import { WhyVedaham } from "@/components/vedaham/why-vedaham"
import { FinalCta } from "@/components/vedaham/final-cta"
import { Footer } from "@/components/vedaham/footer"
import { MotionProvider } from "@/components/vedaham/motion"

export default function Page() {
  return (
    <MotionProvider>
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <Problem />
        <Solution />
        <AiLoop />
        <Academics />
        <DifferentPaths />
        <Skills />
        <SkillGap />
        <Industry />
        <AiTutor />
        <Mastery />
        <Revision />
        <AcademicsToCareer />
        <DashboardPreview />
        <Engagement />
        <WhyVedaham />
        <FinalCta />
      </main>
      <Footer />
    </MotionProvider>
  )
}
