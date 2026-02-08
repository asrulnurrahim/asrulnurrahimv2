import { getProjects } from "@/services/db";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects | Asrul Nur Rahim",
  description: "Showcase of my recent projects, applications, and experiments.",
  openGraph: {
    title: "Projects | Asrul Nur Rahim",
    description:
      "Showcase of my recent projects, applications, and experiments.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/projects`,
    type: "website",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/projects`,
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects | Asrul Nur Rahim",
    description:
      "Showcase of my recent projects, applications, and experiments.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/projects`,
    hasPart: projects.map((project) => ({
      "@type": "CreativeWork",
      name: project.title,
      description: project.summary,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/projects/${project.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-30 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A selection of my work in web development and UI engineering.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group block bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800"
            >
              <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 text-gray-400 dark:text-gray-600">
                  <span className="text-5xl opacity-20">🚀</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#32424a] dark:text-white mb-2 group-hover:text-[#1e282d] transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                  {project.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech_stack?.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
          {projects.length === 0 && (
            <p className="text-center col-span-full text-gray-500">
              No projects found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
