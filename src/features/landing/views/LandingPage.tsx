import { getOwnerProfile } from "@/features/profile/services";
import { siteConfig } from "@/lib/site-config";
import { Hero } from "../components/Hero";
import { ProjectsSection } from "../components/ProjectsSection";
import { BlogSection } from "../components/BlogSection";

export async function LandingPage() {
  const profile = await getOwnerProfile();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Asrul Tech",
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    author: {
      "@type": "Person",
      name: siteConfig.author,
      jobTitle: "Front-End Engineer",
      url: siteConfig.url,
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
