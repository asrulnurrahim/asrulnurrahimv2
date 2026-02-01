"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";

const techs = [
  {
    name: "Tailwind",
    img: "/assets/images/landing/tech-tailwind.svg",
    desc: "Able Pro with Tailwind CSS lets developers create sleek, professional interfaces quickly.",
    link: "#",
    github: "#",
  },
  {
    name: "Bootstrap 5",
    img: "/assets/images/landing/tech-bootstrap.svg",
    desc: "Able Pro Bootstrap 5 - the top choice for responsive, mobile-first design.",
    link: "#",
    github: "#",
  },
  {
    name: "React Material-UI",
    img: "/assets/images/landing/tech-react-1.svg",
    desc: "Able Pro React dashboard template utilizes Material-UI component library.",
    link: "#",
    github: "#",
  },
  {
    name: "Asp.net",
    img: "/assets/images/landing/tech-net.svg",
    desc: "Able Pro .NET version is a robust dashboard template designed specifically for .NET developers.",
    link: "#",
    github: "#",
  },
  {
    name: "CodeIgniter",
    img: "/assets/images/landing/tech-codeigniter.svg",
    desc: "Able Pro CodeIgniter version is a powerful dashboard template built for CodeIgniter PHP framework.",
    link: "#",
    github: "#",
  },
  {
    name: "Angular",
    img: "/assets/images/landing/tech-angular.svg",
    desc: "Able Pro Angular dashboard template utilizes Google Material component library.",
    link: "#",
    github: "#",
  },
  {
    name: "Next.js",
    img: "/assets/images/landing/tech-nextjs.svg",
    desc: "Able Pro NextJs dashboard template is a powerful tool uses Material-UI.",
    link: "#",
    github: "#",
  },
  {
    name: "Vue",
    img: "/assets/images/landing/tech-vuetify.svg",
    desc: "Able Pro Vue stands out as a versatile and powerful - Vue with Vuetify dashboard.",
    link: "#",
    github: "#",
  },
];

export function Technologies() {
  return (
    <section
      id="technologies"
      className="py-10 sm:py-[100px] bg-white dark:bg-slate-900"
    >
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">
            Available Technologies
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Explore the Demos of Able Pro in multiple technologies.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techs.map((tech, idx) => (
            <div
              key={idx}
              className="card h-full border border-slate-200 dark:border-slate-800 rounded-lg p-6 bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <img src={tech.img} alt={tech.name} className="h-12 w-auto" />
              </div>
              <h4 className="my-3 text-xl font-semibold text-slate-900 dark:text-white">
                {tech.name}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                {tech.desc}
              </p>
              <div className="flex gap-2 mt-auto">
                <Link
                  href={tech.link}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  target="_blank"
                >
                  <ExternalLink size={14} /> Preview
                </Link>
                <Link
                  href={tech.github}
                  className="inline-flex items-center justify-center w-9 h-9 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  target="_blank"
                >
                  <Github size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
