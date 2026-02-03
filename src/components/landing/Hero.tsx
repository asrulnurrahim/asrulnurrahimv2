"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";

export function Hero() {
  return (
    <header
      id="home"
      className="flex min-h-screen flex-col items-center justify-center overflow-hidden relative py-[100px] bg-[#f5f5f5] dark:bg-[#020817]"
    >
      <div className="container mx-auto px-4">
        <div className="w-full md:w-10/12 text-center mx-auto">
          <div className="mb-6 flex justify-center">
            <img
              src="/me-2.webp"
              alt="Asrul Nur Rahim"
              className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full object-cover shadow-lg border-4 border-white dark:border-slate-800"
            />
          </div>
          <h1 className="text-[22px] md:text-[36px] lg:text-[55px] leading-[1.2] mb-5 font-bold text-slate-900 dark:text-white">
            Front-End Developer —
            <span className="block sm:inline text-transparent bg-clip-text bg-linear-to-r from-[rgb(50,66,74)] via-[rgb(69,134,255)] to-[rgb(1,236,213)] bg-size-[300%_100%] animate-[move-bg_20s_linear_infinite] mx-2">
              Every Pixel Matters.
            </span>
          </h1>

          <div className="w-8/12 mx-auto">
            <p className="text-slate-500 dark:text-slate-400 text-[14px] sm:text-[16px] mb-8">
              Experienced in building clean, precise, and visually consistent
              web interfaces. Focused on performance, SEO best practices,
              semantic HTML, metadata, schema markup, and page speed
              optimization using tools like Google Search Console.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white dark:bg-slate-800 px-6 py-3 text-base font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700 transition"
            >
              View Work
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/90 transition"
            >
              About Me
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
