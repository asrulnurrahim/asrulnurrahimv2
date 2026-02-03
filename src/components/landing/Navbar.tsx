"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "@/components/layout/UserMenu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full backdrop-blur shadow-[0_0_24px_rgba(27,46,94,.05)] dark:shadow-[0_0_24px_rgba(27,46,94,.05)] bg-white/75 dark:bg-slate-900/75 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex py-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[rgb(50,66,74)] via-[rgb(69,134,255)] to-[rgb(1,236,213)] bg-size-[300%_100%] animate-[move-bg_20s_linear_infinite]">
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
              href="/about"
              className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary font-medium transition-colors"
            >
              About
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
              Blogs
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
            <ThemeToggle />
            <UserMenu />
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
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col gap-4">
          <Link
            href="/about"
            className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary font-medium transition-colors"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="#"
            className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary font-medium transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link
            href="#"
            className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary font-medium transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Blogs
          </Link>
          <Link
            href="https://phoenixcoded.gitbook.io/able-pro"
            target="_blank"
            className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary font-medium transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Theme:
            </span>
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      )}
    </nav>
  );
}
