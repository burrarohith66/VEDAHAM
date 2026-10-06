import { Navbar } from "@/components/marketing/navbar"
import { Hero } from "@/components/marketing/hero"
import { Problem } from "@/components/marketing/problem"
import { Solution } from "@/components/marketing/solution"
import { AiLoop } from "@/components/marketing/ai-loop"
import { Academics } from "@/components/marketing/academics"
import { DifferentPaths } from "@/components/marketing/different-paths"
import { Skills } from "@/components/marketing/skills"
import { SkillGap } from "@/components/marketing/skill-gap"
import { Industry } from "@/components/marketing/industry"
import { AiTutor } from "@/components/marketing/ai-tutor"
import { Mastery } from "@/components/marketing/mastery"
import { Revision } from "@/components/marketing/revision"
import { AcademicsToCareer } from "@/components/marketing/academics-to-career"
import { DashboardPreview } from "@/components/marketing/dashboard-preview"
import { Engagement } from "@/components/marketing/engagement"
import { WhyVedaham } from "@/components/marketing/why-vedaham"
import { FinalCta } from "@/components/marketing/final-cta"
import { Footer } from "@/components/marketing/footer"
import { MotionProvider } from "@/components/marketing/motion"

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
