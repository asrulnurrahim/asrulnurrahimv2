import { Hero } from "@/components/landing/Hero";
// import { Technologies } from "@/components/landing/Technologies";
// import { FeatureCombo } from "@/components/landing/FeatureCombo";
// import { WorkingApps } from "@/components/landing/WorkingApps";
// import { CallToAction } from "@/components/landing/CallToAction";
// import { Testimonials } from "@/components/landing/Testimonials";
import { PortfolioSection } from "@/components/landing/PortfolioSection";
import { BlogSection } from "@/components/landing/BlogSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Hero />
      {/* <Technologies /> */}
      {/* <FeatureCombo /> */}
      <PortfolioSection />
      {/* <WorkingApps /> */}
      <BlogSection />
      {/* <CallToAction /> */}
      {/* <Testimonials /> */}
    </div>
  );
}
