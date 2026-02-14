"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Profile } from "@/lib/types";

export function Hero({ profile }: { profile: Profile | null }) {
  return (
    <header
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f5f5f5] py-[100px] dark:bg-[#020817]"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto w-full text-center md:w-10/12">
          <div className="mb-6 flex justify-center">
            <Image
              src={profile?.avatar_url || "/me-2.webp"}
              alt={profile?.full_name || "Asrul Nur Rahim"}
              width={150}
              height={150}
              className="h-[120px] w-[120px] rounded-full border-4 border-white object-cover shadow-lg md:h-[150px] md:w-[150px] dark:border-slate-800"
            />
          </div>
          <h1 className="mb-5 text-[22px] leading-[1.2] font-bold text-slate-900 md:text-[36px] lg:text-[55px] dark:text-white">
            {profile?.headline || "Front-End Developer"} —
            <span className="mx-2 block animate-[move-bg_20s_linear_infinite] bg-linear-to-r from-[rgb(50,66,74)] via-[rgb(69,134,255)] to-[rgb(1,236,213)] bg-size-[300%_100%] bg-clip-text text-transparent sm:inline">
              Every Pixel Matters.
            </span>
          </h1>

          <div className="mx-auto w-8/12">
            <p className="mb-8 text-[14px] text-slate-500 sm:text-[16px] dark:text-slate-400">
              Experienced in building clean, precise, and visually consistent
              web interfaces. Focused on performance, SEO best practices,
              semantic HTML, metadata, schema markup, and page speed
              optimization using tools like Google Search Console.
            </p>
          </div>

          <div className="mb-12 flex flex-wrap justify-center gap-4">
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              View Work
            </Link>
            <Link
              href="#"
              className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm transition"
            >
              About Me
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
