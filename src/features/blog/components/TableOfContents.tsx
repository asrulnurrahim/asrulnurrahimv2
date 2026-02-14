"use client";

import { useEffect, useState } from "react";
import { TocItem } from "@/lib/toc";
import { ChevronDown, ChevronRight, List } from "lucide-react";

interface TableOfContentsProps {
  headings: TocItem[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle

  // Smooth scroll handler
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Calculate offset for sticky header if exists, or just padding
      const offset = 100; // ample space
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveId(id);
      setIsOpen(false); // Close mobile menu on click
    }
  };

  // Intersection Observer to highlight active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" },
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav className="toc-container">
      {/* Mobile / Tablet Accordion */}
      <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:hidden dark:border-gray-800 dark:bg-slate-900">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between p-4 text-left font-medium text-gray-900 dark:text-white"
        >
          <span className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Table of Contents
          </span>
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {isOpen && (
          <div className="max-h-[60vh] overflow-y-auto border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-slate-950/50">
            <ul className="space-y-3 text-sm">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
                >
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleClick(e, heading.id)}
                    className={`block transition-colors duration-200 ${
                      activeId === heading.id
                        ? "font-semibold text-blue-600 dark:text-blue-400"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Desktop Sticky Sidebar */}
      <div className="sticky top-32 hidden lg:block">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-white">
          <List className="h-4 w-4" />
          On this page
        </h4>
        <ul className="relative space-y-3 border-l border-gray-200 text-sm dark:border-gray-800">
          {/* Active Indicator Line (visual enhancement idea, simplified here to border-l active class on items) */}
          {headings.map((heading) => (
            <li key={heading.id} className="relative">
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={`-ml-px block border-l-2 py-1 pl-4 transition-all duration-200 ${
                  activeId === heading.id
                    ? "border-blue-600 font-medium text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-200"
                }`}
                style={{ marginLeft: `${(heading.level - 2) * 0.5}rem` }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
