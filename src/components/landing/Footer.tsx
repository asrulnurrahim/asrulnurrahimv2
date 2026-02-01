"use client";
import React from "react";
import Link from "next/link";
import { Github, Youtube, Dribbble } from "lucide-react";

export function Footer() {
  return (
    <footer className="pt-10 sm:pt-[100px] pb-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <h2 className="mb-3 text-2xl font-normal text-slate-900 dark:text-white">
              Need Support?
            </h2>
            <p className="mb-4 md:mb-0 text-slate-500 dark:text-slate-400">
              Have questions? Our expert support team is ready to help. Submit a
              ticket, and we’ll assist you promptly.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link
              href="https://phoenixcoded.authordesk.app/"
              target="_blank"
              className="inline-block rounded-md bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/90 transition"
            >
              Get Support
            </Link>
          </div>
        </div>
      </div>

      <div className="py-[60px] mb-5 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              {/* <img src="/assets/images/logo-dark.svg" alt="image" className="img-fluid mb-4" /> */}
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Able Pro
              </h2>
              <p className="mb-5 text-slate-500 dark:text-slate-400">
                Phoenixcoded has gained the trust of over 5.5K+ customers since
                2015, thanks to our commitment to delivering high-quality
                products.
              </p>
            </div>

            <div className="md:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <h5 className="mb-3 sm:mb-5 font-semibold text-slate-900 dark:text-white">
                    Company
                  </h5>
                  <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                    <li>
                      <Link href="#" className="hover:text-primary transition">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-primary transition">
                        Portfolio
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
                  <h5 className="mb-3 sm:mb-5 font-semibold text-slate-900 dark:text-white">
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
                  <h5 className="mb-3 sm:mb-5 font-semibold text-slate-900 dark:text-white">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-slate-500 dark:text-slate-400 text-center sm:text-left">
            <p className="mb-0">
              © Handcrafted by Team{" "}
              <Link href="#" className="text-primary hover:underline">
                Phoenixcoded
              </Link>
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-slate-500 hover:text-primary transition"
            >
              <Github size={20} />
            </Link>
            <Link
              href="#"
              className="text-slate-500 hover:text-primary transition"
            >
              <Dribbble size={20} />
            </Link>
            <Link
              href="#"
              className="text-slate-500 hover:text-primary transition"
            >
              <Youtube size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
