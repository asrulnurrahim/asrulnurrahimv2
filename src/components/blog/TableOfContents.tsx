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
      <div className="lg:hidden mb-8 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-4 text-left font-medium text-gray-900 dark:text-white"
        >
          <span className="flex items-center gap-2">
            <List className="w-5 h-5" />
            Table of Contents
          </span>
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {isOpen && (
          <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-950/50 p-4 max-h-[60vh] overflow-y-auto">
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
                        ? "text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
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
      <div className="hidden lg:block sticky top-32">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <List className="w-4 h-4" />
          On this page
        </h4>
        <ul className="space-y-3 text-sm border-l border-gray-200 dark:border-gray-800 relative">
          {/* Active Indicator Line (visual enhancement idea, simplified here to border-l active class on items) */}
          {headings.map((heading) => (
            <li key={heading.id} className="relative">
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={`block pl-4 py-1 border-l-2 -ml-[1px] transition-all duration-200 ${
                  activeId === heading.id
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-medium"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700"
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
