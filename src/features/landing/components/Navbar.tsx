"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "@/components/shell/UserMenu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks: { href: string; label: string; external?: boolean }[] = [
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blogs" },
    // {
    //   href: "#",
    //   label: "Contact",
    //   external: true,
    // },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/75 shadow-[0_0_24px_rgba(27,46,94,.05)] backdrop-blur transition-colors dark:bg-slate-900/75 dark:shadow-[0_0_24px_rgba(27,46,94,.05)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="animate-[move-bg_20s_linear_infinite] bg-linear-to-r from-[rgb(50,66,74)] via-[rgb(69,134,255)] to-[rgb(1,236,213)] bg-size-[300%_100%] bg-clip-text text-xl font-bold text-transparent">
                Asrul Nur Rahim
              </span>
            </Link>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
              v1.0.0
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-600 lg:hidden dark:text-slate-300"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="flex flex-col gap-2 border-t border-slate-200 bg-white p-4 lg:hidden dark:border-slate-800 dark:bg-slate-900">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              className="rounded-lg px-4 py-3 text-base font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
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
