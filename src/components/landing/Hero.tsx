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
          <h1 className="text-[22px] md:text-[36px] lg:text-[55px] leading-[1.2] mb-5 font-bold text-slate-900 dark:text-white">
            Explore One of the
            <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-[#32424A] via-[#4586FF] to-[#01ECD5] bg-[length:400%_100%] animate-[move-bg_24s_infinite_linear] mx-2">
              Featured Dashboard
            </span>
            Template in Themeforest
          </h1>

          <div className="w-8/12 mx-auto">
            <p className="text-slate-500 dark:text-slate-400 text-[14px] sm:text-[16px] mb-8">
              Able Pro is the one of the Featured admin dashboard template in
              Envato Marketplace and used by over 5.5K+ Customers worldwide.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white dark:bg-slate-800 px-6 py-3 text-base font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700 transition"
            >
              Explore Components
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/90 transition"
            >
              Live Preview
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="text-center">
              <div className="flex gap-1 mb-2 justify-center">
                {[1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="fill-yellow-400 text-yellow-400 w-5 h-5"
                  />
                ))}
                <div className="relative w-5 h-5">
                  <Star className="text-yellow-400 w-5 h-5 absolute" />
                  <Star
                    className="fill-yellow-400 text-yellow-400 w-5 h-5 absolute clip-path-half"
                    style={{ clipPath: "inset(0 50% 0 0)" }}
                  />
                </div>
              </div>
              <h4 className="mb-0 text-lg font-bold text-slate-900 dark:text-white">
                4.7/5{" "}
                <small className="text-slate-500 dark:text-slate-400 font-normal text-sm">
                  Ratings
                </small>
              </h4>
            </div>

            <div className="hidden sm:block">
              <span className="inline-block w-px h-8 bg-slate-200 dark:bg-slate-700"></span>
            </div>

            <div className="text-center">
              <h5 className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                Sales
              </h5>
              <h4 className="mb-0 text-lg font-bold text-slate-900 dark:text-white">
                5.5K+
              </h4>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
