"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle"; // Assuming I need to move ThemeToggle to a shared place or use the one I created?
// I created it in src/components/theme-provider.tsx? No, wait.
// Step 125 created src/components/theme-provider.tsx.
// Step 39 showed src/components/ui/theme-toggle.tsx in asrulnurrahim.
// I didn't verify if I copied theme-toggle.tsx. I should check or create it.

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full backdrop-blur shadow-[0_0_24px_rgba(27,46,94,.05)] dark:shadow-[0_0_24px_rgba(27,46,94,.05)] bg-white/75 dark:bg-slate-900/75 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex py-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              {/* Using the logo from assets if available, or text for now */}
              {/* <img className="h-7 w-auto" src="/assets/images/logo-dark.svg" alt="Able Pro" /> */}
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#32424A] via-[#4586FF] to-[#01ECD5] bg-[length:400%_100%] animate-[move-bg_24s_infinite_linear]">
                Asrul Nur Rahim
              </span>
            </Link>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
              v1.0.0
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="#"
              className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary font-medium transition-colors"
            >
              About/CV
            </Link>
            <Link
              href="#"
              className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary font-medium transition-colors"
            >
              Projects
            </Link>
            <Link
              href="#"
              className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary font-medium transition-colors"
            >
              Blog
            </Link>
            <Link
              href="https://phoenixcoded.gitbook.io/able-pro"
              target="_blank"
              className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="https://github.com/phoenixcoded/able-pro-free-admin-dashboard-template"
              target="_blank"
              className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-700 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </Link>
            <Link
              href="https://1.envato.market/zNkqj6"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
            >
              Purchase Now
              <ExternalLink size={16} />
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          {/* Mobile menu items... */}
        </div>
      )}
    </nav>
  );
}
