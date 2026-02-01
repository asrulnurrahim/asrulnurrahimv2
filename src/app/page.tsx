import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Technologies } from "@/components/landing/Technologies";
import { FeatureCombo } from "@/components/landing/FeatureCombo";
import { FigmaFeature } from "@/components/landing/FigmaFeature";
import { WorkingApps } from "@/components/landing/WorkingApps";
import { CallToAction } from "@/components/landing/CallToAction";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <Hero />
      <Technologies />
      <FeatureCombo />
      <FigmaFeature />
      <WorkingApps />
      <CallToAction />
      <Testimonials />
      <Footer />
    </main>
  );
}
