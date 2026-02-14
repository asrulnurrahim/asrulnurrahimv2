"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export function FeatureCombo() {
  return (
    <section className="bg-slate-50 py-10 sm:py-[100px] dark:bg-slate-950/50">
      <div className="container mx-auto mb-12 px-4">
        <div className="mx-auto max-w-2xl text-center">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card h-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="card-body mt-2">
              <h5 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                Explore Components
              </h5>
              <p className="mb-4 text-slate-500 dark:text-slate-400">
                Access all components of Able Pro in one place to make your
                development work easier.
              </p>
              <Image
                className="w-full rounded pt-2"
                src="/assets/images/landing/feature-components.png"
                alt="Feature Components"
                width={600}
                height={400}
              />
              <Link
                href="#"
                className="mt-4 inline-flex items-center gap-2 rounded bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                View All Components <ExternalLink size={14} />
              </Link>
            </div>
          </div>
          <div className="card h-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="card-body mt-2">
              <h5 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                Documentation
              </h5>
              <p className="mb-4 text-slate-500 dark:text-slate-400">
                Find solutions and navigate through our helper guide with ease.
              </p>
              <Image
                className="w-full rounded pt-2"
                src="/assets/images/landing/feature-documentation.png"
                alt="Feature Documentation"
                width={600}
                height={400}
              />
              <Link
                href="https://phoenixcoded.gitbook.io/able-pro"
                target="_blank"
                className="mt-4 inline-flex items-center gap-2 rounded bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
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
