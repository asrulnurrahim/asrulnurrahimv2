import { getProjects } from "@/features/projects/services";
import { siteConfig } from "@/lib/site-config";
import Link from "next/link";
import { Project } from "@/features/projects/types";
import Image from "next/image";

export default async function ProjectList() {
  const projects = await getProjects();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects | Asrul Tech",
    description:
      "Showcase of my recent projects, applications, and experiments.",
    url: `${siteConfig.url}/projects`,
    hasPart: projects.map((project: Project) => ({
      "@type": "CreativeWork",
      name: project.title,
      description: project.summary,
      url: `${siteConfig.url}/projects/${project.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-30 pb-16 dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Projects
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
            A selection of my work in web development and UI engineering.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: Project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-slate-900"
            >
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800">
                {project.thumbnail_url ? (
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-blue-500/5 to-purple-500/5 text-gray-400 transition-transform duration-500 group-hover:scale-105 dark:text-gray-600">
                    <span className="text-5xl opacity-20">🚀</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-[#32424a] transition-colors group-hover:text-[#1e282d] dark:text-white dark:group-hover:text-blue-400">
                  {project.title}
                </h3>
                <p className="line-clamp-2 text-gray-600 dark:text-gray-400">
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
            <p className="col-span-full text-center text-gray-500">
              No projects found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
