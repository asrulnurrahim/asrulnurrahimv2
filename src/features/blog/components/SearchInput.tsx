"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-slate-900">
      <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
        Search Article
      </h3>
      <div className="relative">
        <input
          type="text"
          placeholder="Type to search..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("search")?.toString()}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-gray-900 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}
