import Link from "next/link";
import { getFeaturedProjects } from "@/features/projects/services";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export async function ProjectsSection() {
  const projects = await getFeaturedProjects(3);

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-20 md:py-28 dark:bg-gray-950/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Selected Work
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            A showcase of recent projects, applications, and experiments.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Image / Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
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

              {/* Card Content */}
              <div className="flex flex-1 flex-col p-6">
                {/* Tech Stack */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span
                      key={tech.name}
                      className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                    >
                      {tech.name}
                    </span>
                  ))}
                  {(project.technologies?.length || 0) > 3 && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      +{project.technologies!.length - 3}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  className="mb-2 line-clamp-2 text-xl font-bold text-[#32424a] transition-colors group-hover:text-[#1e282d] dark:text-white dark:group-hover:text-blue-400"
                  title={project.title}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="focus:outline-none"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    {project.title}
                  </Link>
                </h3>

                {/* Summary */}
                <p className="mb-6 line-clamp-3 flex-1 text-gray-600 dark:text-gray-400">
                  {project.summary}
                </p>

                {/* Footer / Link */}
                <div className="mt-auto flex items-center text-sm font-semibold text-[#32424a] group-hover:text-[#1e282d] dark:text-blue-400 dark:group-hover:text-blue-300">
                  View Case Study
                  <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-16 text-center">
          <Link
            href="/projects"
            className="dark:hover:bg-gray-750 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-8 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
