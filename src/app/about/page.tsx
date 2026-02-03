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
import Image from "next/image";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

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
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Asrul Nurrahim",
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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col pt-20">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
              Front-End Developer
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Core Competencies */}
      <section className="py-16 bg-white dark:bg-gray-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Core Competencies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <SkillCard
              icon={<Eye className="w-6 h-6 text-blue-500" />}
              title="Visual Precision"
              description="Obsessive attention to detail. Implementing designs with pixel-perfect accuracy and maintaining visual consistency across the entire application."
            />
            <SkillCard
              icon={<Rocket className="w-6 h-6 text-violet-500" />}
              title="Performance First"
              description="Optimizing Core Web Vitals, minimizing bundle sizes, and ensuring buttery smooth 60fps animations."
            />
            <SkillCard
              icon={<Search className="w-6 h-6 text-green-500" />}
              title="SEO Mastery"
              description="Implementing semantic HTML, JSON-LD schema markup, and metadata strategies to dominate search rankings."
            />
            <SkillCard
              icon={<Code className="w-6 h-6 text-pink-500" />}
              title="Modern Tech Stack"
              description="Expertise in React, Next.js, TypeScript, and Tailwind CSS to build scalable and maintainable codebases."
            />
            <SkillCard
              icon={<Layout className="w-6 h-6 text-orange-500" />}
              title="Responsive Design"
              description="Creating fluid layouts that adapt perfectly to any device, from large desktops to mobile phones."
            />
            <SkillCard
              icon={<Globe className="w-6 h-6 text-cyan-500" />}
              title="Accessibility"
              description="Building inclusive experiences that adhere to WCAG guidelines, ensuring usability for everyone."
            />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-gray-400" />
            Experience
          </h2>

          <div className="space-y-12 border-l-2 border-gray-200 dark:border-gray-800 ml-3 md:ml-0 pl-8 md:pl-0">
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
      <section className="py-20 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Let's Build Something Amazing
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your visions.
          </p>
          <a
            href="mailto:contact@asrulnurrahim.com"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
          >
            Get in Touch <ChevronRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>
      <Footer />
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
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
      <div className="mb-4 bg-white dark:bg-gray-900 p-3 rounded-xl w-fit border border-gray-100 dark:border-gray-800">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
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
      <div className="absolute top-0 -left-[41px] md:-left-[9px] w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-gray-950 shadow-sm"></div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {role}
        </h3>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">
          {period}
        </span>
      </div>
      <div className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-3">
        {company}
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
