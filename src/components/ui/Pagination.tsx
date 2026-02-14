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
    <div className="mt-12 flex items-center justify-center gap-4">
      {hasPrev ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
          rel="prev"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span className="flex cursor-not-allowed items-center rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-400 dark:border-gray-800 dark:bg-slate-800 dark:text-gray-600">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </span>
      )}

      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
          rel="next"
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      ) : (
        <span className="flex cursor-not-allowed items-center rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-400 dark:border-gray-800 dark:bg-slate-800 dark:text-gray-600">
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </span>
      )}
    </div>
  );
}
