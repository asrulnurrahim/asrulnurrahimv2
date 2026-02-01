"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function FeatureCombo() {
  return (
    <section className="py-10 sm:py-[100px] bg-slate-50 dark:bg-slate-950/50">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">
            Complete Combo
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Able Pro caters to the needs of both developers and designers,
            whether they are beginners or experts.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card h-full border border-slate-200 dark:border-slate-800 rounded-lg p-6 bg-white dark:bg-slate-950 shadow-sm">
            <div className="card-body mt-2">
              <h5 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                Explore Components
              </h5>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Access all components of Able Pro in one place to make your
                development work easier.
              </p>
              <img
                className="pt-2 w-full rounded"
                src="/assets/images/landing/feature-components.png"
                alt="Feature Components"
              />
              <Link
                href="#"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                View All Components <ExternalLink size={14} />
              </Link>
            </div>
          </div>
          <div className="card h-full border border-slate-200 dark:border-slate-800 rounded-lg p-6 bg-white dark:bg-slate-950 shadow-sm">
            <div className="card-body mt-2">
              <h5 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                Documentation
              </h5>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Find solutions and navigate through our helper guide with ease.
              </p>
              <img
                className="pt-2 w-full rounded"
                src="/assets/images/landing/feature-documentation.png"
                alt="Feature Documentation"
              />
              <Link
                href="https://phoenixcoded.gitbook.io/able-pro"
                target="_blank"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Check Documentation <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
