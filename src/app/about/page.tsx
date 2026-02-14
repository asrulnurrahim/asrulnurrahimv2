import type { Metadata } from "next";
import {
  Briefcase,
  Code,
  Eye,
  Layout,
  Rocket,
  Search,
  Globe,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Me - Front-End Developer & UI Specialist",
  description:
    "Experienced Front-End Developer with a focus on visual perfection, performance optimization, and SEO.",
  metadataBase: new URL("https://asrulnurrahim.com"),
  openGraph: {
    title: "About Me - Front-End Developer & UI Specialist",
    description:
      "Building clean, precise, and visually consistent web interfaces with a focus on performance and SEO.",
    type: "profile",
    images: ["/images/og-about.jpg"], // Update with actual OG image if available
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Asrul Nur Rahim",
    jobTitle: "Front-End Developer",
    description:
      "Front-End Developer with strong visual skills and high attention to detail.",
    url: "https://asrulnurrahim.com/about", // Adjust based on actual domain
    sameAs: [
      "https://github.com/asrulnurrahim",
      "https://linkedin.com/in/asrulnurrahim",
      // Add other social links
    ],
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-50 pt-20 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 bg-linear-to-r from-blue-600 to-violet-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl dark:from-blue-400 dark:to-violet-400">
              Front-End Developer
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-gray-600 md:text-2xl dark:text-gray-300">
              Crafting pixel-perfect, high-performance web experiences with
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {" "}
                precision
              </span>{" "}
              and
              <span className="font-semibold text-violet-600 dark:text-violet-400">
                {" "}
                passion
              </span>
              .
            </p>
          </div>
        </div>

        {/* Abstract Background Decoration */}
        <div className="pointer-events-none absolute top-0 left-1/2 h-full w-full max-w-7xl -translate-x-1/2 opacity-30">
          <div className="animate-blob absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
          <div className="animate-blob animation-delay-2000 absolute top-20 right-10 h-72 w-72 rounded-full bg-violet-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
          <div className="animate-blob animation-delay-4000 absolute -bottom-32 left-1/2 h-72 w-72 rounded-full bg-pink-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
        </div>
      </section>

      {/* Core Competencies */}
      <section className="bg-white py-16 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Core Competencies
          </h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <SkillCard
              icon={<Eye className="h-6 w-6 text-blue-500" />}
              title="Visual Precision"
              description="Obsessive attention to detail. Implementing designs with pixel-perfect accuracy and maintaining visual consistency across the entire application."
            />
            <SkillCard
              icon={<Rocket className="h-6 w-6 text-violet-500" />}
              title="Performance First"
              description="Optimizing Core Web Vitals, minimizing bundle sizes, and ensuring buttery smooth 60fps animations."
            />
            <SkillCard
              icon={<Search className="h-6 w-6 text-green-500" />}
              title="SEO Mastery"
              description="Implementing semantic HTML, JSON-LD schema markup, and metadata strategies to dominate search rankings."
            />
            <SkillCard
              icon={<Code className="h-6 w-6 text-pink-500" />}
              title="Modern Tech Stack"
              description="Expertise in React, Next.js, TypeScript, and Tailwind CSS to build scalable and maintainable codebases."
            />
            <SkillCard
              icon={<Layout className="h-6 w-6 text-orange-500" />}
              title="Responsive Design"
              description="Creating fluid layouts that adapt perfectly to any device, from large desktops to mobile phones."
            />
            <SkillCard
              icon={<Globe className="h-6 w-6 text-cyan-500" />}
              title="Accessibility"
              description="Building inclusive experiences that adhere to WCAG guidelines, ensuring usability for everyone."
            />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <h2 className="mb-12 flex items-center gap-3 text-3xl font-bold">
            <Briefcase className="h-8 w-8 text-gray-400" />
            Experience
          </h2>

          <div className="ml-3 space-y-12 border-l-2 border-gray-200 pl-8 md:ml-0 md:pl-0 dark:border-gray-800">
            {/* Experience Item 1 */}
            <ExperienceItem
              role="Senior Front-End Developer"
              company="Tech Company Inc."
              period="2023 - Present"
              description="Leading the frontend architecture migration to Next.js 14+. Improved LCP by 40% and established a comprehensive design system."
              tags={["Next.js", "React", "TypeScript", "Tailwind"]}
            />
            {/* Experience Item 2 */}
            <ExperienceItem
              role="Front-End Developer"
              company="Creative Agency"
              period="2021 - 2023"
              description="Developed high-converting landing pages and complex web applications. Collaborated closely with designers to ensure visual fidelity."
              tags={["Vue.js", "GSAP", "SCSS", "Webpack"]}
            />
            {/* Experience Item 3 */}
            <ExperienceItem
              role="Web Developer"
              company="Freelance"
              period="2019 - 2021"
              description="Delivered custom websites for diverse clients. Focused on responsive design, CMS integration, and SEO optimization."
              tags={["HTML/CSS", "JavaScript", "WordPress", "PHP"]}
            />
          </div>
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section className="border-t border-gray-200 bg-gray-100 py-20 dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">
            Let&apos;s Build Something Amazing
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-600 dark:text-gray-400">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of your visions.
          </p>
          <a
            href="mailto:contact@asrulnurrahim.com"
            className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
          >
            Get in Touch <ChevronRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}

function SkillCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-shadow duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 w-fit rounded-xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

function ExperienceItem({
  role,
  company,
  period,
  description,
  tags,
}: {
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}) {
  return (
    <div className="relative md:pl-8">
      {/* Timeline Dot */}
      <div className="absolute top-0 -left-[41px] h-4 w-4 rounded-full border-4 border-white bg-blue-600 shadow-sm md:-left-[9px] dark:border-gray-950"></div>

      <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {role}
        </h3>
        <span className="mt-2 w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-500 sm:mt-0 dark:bg-gray-800 dark:text-gray-400">
          {period}
        </span>
      </div>
      <div className="mb-3 text-lg font-medium text-blue-600 dark:text-blue-400">
        {company}
      </div>
      <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
