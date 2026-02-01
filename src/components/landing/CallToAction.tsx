"use client";
import React from "react";
import Link from "next/link";
import { Github } from "lucide-react";

export function CallToAction() {
  return (
    <section className="bg-white dark:bg-slate-900 py-10 sm:py-[100px] border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="text-center md:text-left">
            <h2 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">
              <span className="text-primary">TRY</span> BEFORE BUY
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-4 md:mb-0">
              Download the Free MIT Able Pro Dashboard Template before make your
              purchase decision.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white dark:bg-slate-800 px-6 py-3 text-base font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Check out Pro Version
            </Link>
            <Link
              href="https://github.com/phoenixcoded/able-pro-free-admin-dashboard-template"
              target="_blank"
              className="inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/90 transition"
            >
              <Github size={18} /> Free Version
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
