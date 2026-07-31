import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { SolutionsSection } from "@/components/sections/SolutionsSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { CtaFinalSection } from "@/components/sections/CtaFinalSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <HeroSection />
      <ProblemSection />
      <SolutionsSection />
      <TimelineSection />
      <CtaFinalSection />
    </main>
  );
}
