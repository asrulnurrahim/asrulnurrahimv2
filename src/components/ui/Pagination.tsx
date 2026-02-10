import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string | number | undefined>;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, value.toString());
      }
    });
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      {hasPrev ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          rel="prev"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Link>
      ) : (
        <span className="flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </span>
      )}

      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          rel="next"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Link>
      ) : (
        <span className="flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed">
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </span>
      )}
    </div>
  );
}
