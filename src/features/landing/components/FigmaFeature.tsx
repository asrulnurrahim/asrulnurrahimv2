"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, ShoppingCart } from "lucide-react";

export function FigmaFeature() {
  return (
    <section className="bg-white py-10 sm:py-[100px] dark:bg-slate-900">
      <div className="container mx-auto mb-12 px-4">
        <div className="mx-auto max-w-2xl text-center">
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
        <div className="mb-6 flex justify-center">
          <div className="basis-full md:basis-10/12 lg:basis-8/12">
            <Image
              className="w-full"
              src="/assets/images/landing/figma-light.png"
              alt="Figma Design System"
              width={1000}
              height={600}
            />
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <Link
            href="https://codedthemes.com/item/able-pro-free-figma-ui-kit/"
            target="_blank"
            className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm transition"
          >
            <Download size={18} /> Free Figma
          </Link>
          <Link
            href="https://codedthemes.com/item/able-pro-figma-ui-kit/"
            target="_blank"
            className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm transition"
          >
            <ShoppingCart size={18} /> Buy Figma
          </Link>
        </div>
      </div>
    </section>
  );
}
