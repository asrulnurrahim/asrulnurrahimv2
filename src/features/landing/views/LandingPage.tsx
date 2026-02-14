import { getOwnerProfile } from "@/features/profile/services";
import { Hero } from "../components/Hero";
import { ProjectsSection } from "../components/ProjectsSection";
import { BlogSection } from "../components/BlogSection";

export async function LandingPage() {
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
        <ProjectsSection />
        <BlogSection />
      </div>
    </>
  );
}
