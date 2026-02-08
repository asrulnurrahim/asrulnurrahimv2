import { getProjectBySlug, getProjects } from "@/services/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Projects`,
    description: project.seo_description || project.summary,
    openGraph: {
      title: project.seo_title || project.title,
      description: project.seo_description || project.summary || "",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/projects/${project.slug}`,
      images: [
        {
          url: "/images/og-project-default.jpg", // Update if project has image
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/projects/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo_title || project.title,
      description: project.seo_description || project.summary || "",
      images: ["/images/og-project-default.jpg"],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    programmingLanguage: project.tech_stack || [],
    author: {
      "@type": "Person",
      name: "Asrul Nur Rahim",
    },
    dateCreated: project.created_at,
    dateModified: project.updated_at,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-30 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/projects"
          className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {project.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            {project.summary}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech_stack?.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        <div className="aspect-video w-full bg-gray-200 dark:bg-slate-900 rounded-2xl overflow-hidden mb-16 flex items-center justify-center relative shadow-sm">
          <span className="text-6xl opacity-20">🚀</span>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            {project.problem && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  The Problem
                </h2>
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                  {project.problem}
                </div>
              </section>
            )}
            {project.solution && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  The Solution
                </h2>
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                  {project.solution}
                </div>
              </section>
            )}
          </div>
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                Project Info
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                    Status
                  </div>
                  <div className="inline-flex px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold capitalize">
                    {project.status}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
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
