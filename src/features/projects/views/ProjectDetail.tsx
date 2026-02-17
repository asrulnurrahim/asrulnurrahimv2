import { getProjectBySlug } from "@/features/projects/services";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { getProjectThumbnailUrl } from "../utils/storage";

interface ProjectDetailProps {
  slug: string;
}

export default async function ProjectDetail({ slug }: ProjectDetailProps) {
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    programmingLanguage: project.technologies?.map((t) => t.name) || [],
    author: {
      "@type": "Person",
      name: "Asrul Nur Rahim",
    },
    dateCreated: project.created_at,
    dateModified: project.updated_at,
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-30 pb-16 dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto max-w-4xl px-4">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center text-sm text-gray-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>

        <header className="mb-12">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
            {project.title}
          </h1>
          <p className="mb-8 text-xl leading-relaxed text-gray-600 dark:text-gray-400">
            {project.summary}
          </p>

          <div className="mb-8 flex flex-wrap gap-2">
            {project.technologies?.map((tech) => (
              <span
                key={tech.name}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-slate-900 dark:text-gray-300"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </header>

        <div className="relative mb-16 flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-200 shadow-sm dark:bg-slate-900">
          {(() => {
            const thumbnailUrl = getProjectThumbnailUrl(
              project.thumbnail,
              project.thumbnail_path,
            );
            return thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-6xl opacity-20">🚀</span>
            );
          })()}
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-12 md:col-span-2">
            {project.problem && (
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  The Problem
                </h2>
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                  {project.problem}
                </div>
              </section>
            )}
            {project.solution && (
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  The Solution
                </h2>
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                  {project.solution}
                </div>
              </section>
            )}
          </div>
          <div className="space-y-8">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-slate-900">
              <h3 className="mb-4 font-bold text-gray-900 dark:text-white">
                Project Info
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Status
                  </div>
                  <div className="inline-flex rounded bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800 capitalize">
                    {project.status}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Date
                  </div>
                  <div className="text-sm font-medium">
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
