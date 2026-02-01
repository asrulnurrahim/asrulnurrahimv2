"use client";

import React from "react";
import Link from "next/link";
import { Download, ShoppingCart } from "lucide-react";

export function FigmaFeature() {
  return (
    <section className="py-10 sm:py-[100px] bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">
            The Complete Figma Design System to Save Hundreds of Hours
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Optimize your workflow with 100% Auto Layout, variables, smart
            variants, and WCAG accessibility. Enjoy super-smart global colors,
            typography, and effects styles + variables, crafted for seamless
            design efficiency!
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex mb-6 justify-center">
          <div className="basis-full md:basis-10/12 lg:basis-8/12">
            <img
              className="w-full"
              src="/assets/images/landing/figma-light.png"
              alt="Figma Design System"
            />
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <Link
            href="https://codedthemes.com/item/able-pro-free-figma-ui-kit/"
            target="_blank"
            className="inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/90 transition"
          >
            <Download size={18} /> Free Figma
          </Link>
          <Link
            href="https://codedthemes.com/item/able-pro-figma-ui-kit/"
            target="_blank"
            className="inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/90 transition"
          >
            <ShoppingCart size={18} /> Buy Figma
          </Link>
        </div>
      </div>
    </section>
  );
}
