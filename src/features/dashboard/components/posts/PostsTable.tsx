"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
} from "lucide-react";
import { Post } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

interface PostsTableProps {
  posts: Post[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onSort?: (field: string) => void;
  currentOptions?: {
    sort?: string;
    order?: "asc" | "desc";
    query?: string;
  };
}

export function PostsTable({
  posts,
  meta,
  isLoading,
  onPageChange,
  onSearch,
  onSort,
  onDelete,
  currentOptions,
}: PostsTableProps) {
  const router = useRouter();
  const supabase = createClient();

  // Search State
  const [text, setText] = useState(currentOptions?.query || "");
  const [query] = useDebounce(text, 500);

  // Sync internal search text with props if they change externally (e.g. navigation)
  const [prevQuery, setPrevQuery] = useState(currentOptions?.query);
  if (currentOptions?.query !== prevQuery) {
    setPrevQuery(currentOptions?.query);
    setText(currentOptions?.query || "");
  }

  // Handle Search
  useEffect(() => {
    if (onSearch) {
      onSearch(query);
    } else {
      // Fallback for non-React Query usage (if any)
      // ... existing router push logic could go here but we are refactoring fully
    }
  }, [query, onSearch]);

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (onDelete) {
      onDelete(id);
      return;
    }

    // Fallback (Legacy)
    if (confirm("Are you sure you want to delete this post?")) {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) {
        alert("Error deleting post: " + error.message);
      } else {
        router.refresh();
      }
    }
  };

  // Sort Handler
  const handleSortClick = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  // Pagination Handler
  const handlePageChangeClick = (newPage: number) => {
    if (newPage < 1 || newPage > meta.last_page) return;
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Render Sort Icon
  const renderSortIcon = (field: string) => {
    const sort = currentOptions?.sort || "created_at";
    const order = currentOptions?.order || "desc";

    if (sort !== field)
      return <ChevronsUpDown size={14} className="text-slate-400" />;
    if (order === "asc") return <ArrowUp size={14} className="text-blue-500" />;
    return <ArrowDown size={14} className="text-blue-500" />;
  };

  return (
    <div
      className={
        isLoading
          ? "pointer-events-none opacity-50 transition-opacity"
          : "transition-opacity"
      }
    >
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Blog Posts
        </h2>
        <Link
          href="/dashboard/posts/create"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Post
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Search Bar */}
        <div className="relative mb-5">
          <input
            type="text"
            placeholder="Search posts by title..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 md:w-80 dark:border-slate-700 dark:bg-slate-800"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Search
            className="absolute top-2.5 left-3 text-slate-400"
            size={18}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th
                  className="group cursor-pointer px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase transition-colors select-none hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  onClick={() => handleSortClick("title")}
                >
                  <div className="flex items-center gap-1">
                    Title {renderSortIcon("title")}
                  </div>
                </th>
                <th
                  className="group cursor-pointer px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase transition-colors select-none hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  onClick={() => handleSortClick("category")}
                >
                  <div className="flex items-center gap-1">
                    Category {renderSortIcon("category")}
                  </div>
                </th>
                <th
                  className="group cursor-pointer px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase transition-colors select-none hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  onClick={() => handleSortClick("status")}
                >
                  <div className="flex items-center gap-1">
                    Status {renderSortIcon("status")}
                  </div>
                </th>
                <th
                  className="group cursor-pointer px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase transition-colors select-none hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  onClick={() => handleSortClick("author")}
                >
                  <div className="flex items-center gap-1">
                    Author {renderSortIcon("author")}
                  </div>
                </th>
                <th
                  className="group cursor-pointer px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase transition-colors select-none hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  onClick={() => handleSortClick("created_at")}
                >
                  <div className="flex items-center gap-1">
                    Created At {renderSortIcon("created_at")}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {post.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        /{post.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {post.categories && post.categories.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <span
                            className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            style={
                              post.categories[0].color
                                ? {
                                    backgroundColor: `${post.categories[0].color}20`,
                                    color: post.categories[0].color,
                                  }
                                : {}
                            }
                          >
                            {post.categories[0].name}
                          </span>
                          {post.categories.length > 1 && (
                            <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              +{post.categories.length - 1}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Uncategorized
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {post.status.charAt(0).toUpperCase() +
                          post.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {post.author?.avatar_url ? (
                          <div className="relative h-6 w-6 overflow-hidden rounded-full">
                            <Image
                              src={post.author.avatar_url}
                              alt={post.author.full_name || ""}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700" />
                        )}
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {post.author?.full_name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {format(new Date(post.created_at), "dd MMM yyyy")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/posts/${post.id}`}
                          className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="cursor-pointer rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                      <p className="text-sm">No posts found</p>
                      {text && (
                        <p className="mt-1 text-xs">
                          Try adjusting your search criteria
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-medium">{(meta.page - 1) * 10 + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(meta.page * 10, meta.total)}
            </span>{" "}
            of <span className="font-medium">{meta.total}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChangeClick(meta.page - 1)}
              disabled={meta.page <= 1}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-50 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Page {meta.page} of {meta.last_page}
            </span>
            <button
              onClick={() => handlePageChangeClick(meta.page + 1)}
              disabled={meta.page >= meta.last_page}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-50 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
