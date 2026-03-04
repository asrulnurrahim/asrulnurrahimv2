"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-10 pb-5 sm:pt-[100px] dark:border-slate-800 dark:bg-slate-900">
      <div className="container mx-auto mb-12 px-4">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="mb-3 text-2xl font-normal text-slate-900 dark:text-white">
              Let&apos;s Collaborate
            </h2>
            <p className="mb-4 text-slate-500 md:mb-0 dark:text-slate-400">
              I&apos;m currently available for new projects and opportunities.
              If you have a project in mind or just want to say hi, feel free to
              reach out!
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link
              href={`mailto:${siteConfig.contact.email}`}
              className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-6 py-3 text-base font-medium text-white shadow-sm transition"
            >
              <Mail size={18} />
              Get in Touch
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-5 border-y border-slate-200 py-[60px] dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <Image
                src="/logo-blue.png"
                alt={siteConfig.siteName}
                width={150}
                height={50}
                className="mb-4 h-12 w-auto object-contain"
              />
              <p className="mb-5 text-slate-500 dark:text-slate-400">
                {siteConfig.description}
              </p>
              <div className="mt-6 flex gap-4">
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  className="text-slate-500 transition hover:text-blue-500"
                >
                  <Github size={20} />
                </Link>
                <Link
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  className="text-slate-500 transition hover:text-blue-500"
                >
                  <Linkedin size={20} />
                </Link>
                <Link
                  href={siteConfig.links.twitter}
                  target="_blank"
                  className="text-slate-500 transition hover:text-blue-500"
                >
                  <Twitter size={20} />
                </Link>
                <Link
                  href={siteConfig.links.instagram}
                  target="_blank"
                  className="text-slate-500 transition hover:text-blue-500"
                >
                  <Instagram size={20} />
                </Link>
              </div>
            </div>

            <div className="md:col-span-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div>
                  <h5 className="mb-3 font-semibold text-slate-900 sm:mb-5 dark:text-white">
                    Navigation
                  </h5>
                  <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                    <li>
                      <Link
                        href="/about"
                        className="hover:text-primary transition"
                      >
                        About Me
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/projects"
                        className="hover:text-primary transition"
                      >
                        Projects
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/blog"
                        className="hover:text-primary transition"
                      >
                        Blog
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="mb-3 font-semibold text-slate-900 sm:mb-5 dark:text-white">
                    Connect
                  </h5>
                  <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                    <li>
                      <Link
                        href={siteConfig.links.github}
                        target="_blank"
                        className="hover:text-primary transition"
                      >
                        GitHub
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={siteConfig.links.linkedin}
                        target="_blank"
                        className="hover:text-primary transition"
                      >
                        LinkedIn
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center text-slate-500 sm:text-left dark:text-slate-400">
            <p className="mb-0">© Handcrafted by {siteConfig.author}</p>
          </div>
          <div className="flex gap-4">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              className="text-slate-500 transition hover:text-blue-500"
            >
              <Github size={20} />
            </Link>
            <Link
              href={siteConfig.links.linkedin}
              target="_blank"
              className="text-slate-500 transition hover:text-blue-500"
            >
              <Linkedin size={20} />
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              className="text-slate-500 transition hover:text-blue-500"
            >
              <Twitter size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
