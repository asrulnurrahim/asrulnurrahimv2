"use client";
import React from "react";
import Link from "next/link";
import { Github } from "lucide-react";

export function CallToAction() {
  return (
    <section className="border-b border-slate-200 bg-white py-10 sm:py-[100px] dark:border-slate-800 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h2 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">
              <span className="text-primary">TRY</span> BEFORE BUY
            </h2>
            <p className="mb-4 text-slate-500 md:mb-0 dark:text-slate-400">
              Download the Free MIT Able Pro Dashboard Template before make your
              purchase decision.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Check out Pro Version
            </Link>
            <Link
              href="https://github.com/phoenixcoded/able-pro-free-admin-dashboard-template"
              target="_blank"
              className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm transition"
            >
              <Github size={18} /> Free Version
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
