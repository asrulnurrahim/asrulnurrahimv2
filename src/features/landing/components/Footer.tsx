"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Github,
  Youtube,
  Dribbble,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-10 pb-5 sm:pt-[100px] dark:border-slate-800 dark:bg-slate-900">
      <div className="container mx-auto mb-12 px-4">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="mb-3 text-2xl font-normal text-slate-900 dark:text-white">
              Need Support?
            </h2>
            <p className="mb-4 text-slate-500 md:mb-0 dark:text-slate-400">
              Have questions? Our expert support team is ready to help. Submit a
              ticket, and we’ll assist you promptly.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link
              href="https://phoenixcoded.authordesk.app/"
              target="_blank"
              className="bg-primary hover:bg-primary/90 inline-block rounded-md px-6 py-3 text-base font-medium text-white shadow-sm transition"
            >
              Get Support
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
                alt="Asrul Tech"
                width={150}
                height={50}
                className="mb-4 h-12 w-auto object-contain"
              />
              <p className="mb-5 text-slate-500 dark:text-slate-400">
                Experienced in building clean, precise, and visually consistent
                web interfaces. Focused on performance, SEO best practices,
                optimization using tools like Google Search Console.
              </p>
              <div className="mt-6 flex gap-4">
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  className="text-slate-500 transition hover:text-(--primary-hover)"
                >
                  <Facebook size={20} />
                </Link>
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  className="text-slate-500 transition hover:text-(--primary-hover)"
                >
                  <Instagram size={20} />
                </Link>
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  className="text-slate-500 transition hover:text-(--primary-hover)"
                >
                  <Linkedin size={20} />
                </Link>
                <Link
                  href="https://tiktok.com"
                  target="_blank"
                  className="text-slate-500 transition hover:text-(--primary-hover)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-music-2"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </Link>
                <Link
                  href="https://youtube.com"
                  target="_blank"
                  className="text-slate-500 transition hover:text-(--primary-hover)"
                >
                  <Youtube size={20} />
                </Link>
              </div>
            </div>

            <div className="md:col-span-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div>
                  <h5 className="mb-3 font-semibold text-slate-900 sm:mb-5 dark:text-white">
                    Company
                  </h5>
                  <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                    <li>
                      <Link href="#" className="hover:text-primary transition">
                        Profile
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
                      <Link href="#" className="hover:text-primary transition">
                        Follow Us
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-primary transition">
                        Website
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="mb-3 font-semibold text-slate-900 sm:mb-5 dark:text-white">
                    Help & Support
                  </h5>
                  <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                    <li>
                      <Link href="#" className="hover:text-primary transition">
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-primary transition">
                        Feature Request
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-primary transition">
                        RoadMap
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-primary transition">
                        Support
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-primary transition">
                        Email Us
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="mb-3 font-semibold text-slate-900 sm:mb-5 dark:text-white">
                    Useful Resources
                  </h5>
                  <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                    <li>
                      <Link href="#" className="hover:text-primary transition">
                        Support Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-primary transition">
                        Licenses Term
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
            <p className="mb-0">© Handcrafted by Asrul Nur Rahim</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="#"
              className="hover:text-primary text-slate-500 transition"
            >
              <Github size={20} />
            </Link>
            <Link
              href="#"
              className="hover:text-primary text-slate-500 transition"
            >
              <Dribbble size={20} />
            </Link>
            <Link
              href="#"
              className="hover:text-primary text-slate-500 transition"
            >
              <Youtube size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
