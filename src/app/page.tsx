import { Hero } from "@/components/landing/Hero";
// import { Technologies } from "@/components/landing/Technologies";
// import { FeatureCombo } from "@/components/landing/FeatureCombo";
// import { WorkingApps } from "@/components/landing/WorkingApps";
// import { CallToAction } from "@/components/landing/CallToAction";
// import { Testimonials } from "@/components/landing/Testimonials";
import { ProjectsSection } from "@/components/landing/ProjectsSection";
import { BlogSection } from "@/components/landing/BlogSection";
import { getOwnerProfile } from "@/services/db";

export const revalidate = 60; // Revalidate every minute

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asrul Nur Rahim - Front-End Engineer & UI Architect",
  description:
    "Personal website of Asrul Nur Rahim. Specializing in pixel-perfect UI, performance optimization, and scalable front-end architecture.",
  openGraph: {
    type: "website",
    title: "Asrul Nur Rahim - Front-End Engineer",
    description:
      "Crafting high-performance web experiences with precision and passion.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Asrul Nur Rahim",
    images: ["/asrul.jpg"], // Using existing image
  },
};

export default async function Home() {
  const profile = await getOwnerProfile();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Asrul Nur Rahim",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    author: {
      "@type": "Person",
      name: "Asrul Nur Rahim",
      jobTitle: "Front-End Engineer",
      url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      sameAs: [
        "https://github.com/asrulnurrahim",
        "https://linkedin.com/in/asrulnurrahim",
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Hero profile={profile} />
        {/* <Technologies /> */}
        {/* <FeatureCombo /> */}
        <ProjectsSection />
        {/* <WorkingApps /> */}
        <BlogSection />
        {/* <CallToAction /> */}
        {/* <Testimonials /> */}
      </div>
    </>
  );
}
