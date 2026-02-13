"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";

interface PostsTableProps {
  posts: Post[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
  onDelete?: (id: string) => void;
}

export function PostsTable({ posts, meta }: PostsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Search State
  const [text, setText] = useState(searchParams.get("q") || "");
  const [query] = useDebounce(text, 500);

  // Update URL on search
  useEffect(() => {
    const currentQuery = searchParams.get("q") || "";
    if (query === currentQuery) return;

    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    params.set("page", "1"); // Reset to page 1 on search
    router.push(`?${params.toString()}`);
  }, [query, router, searchParams]);

  // Delete Handler
  const handleDelete = async (id: string) => {
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
  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams);
    const currentSort = params.get("sort");
    const currentOrder = params.get("order");

    if (currentSort === field) {
      // Toggle order
      params.set("order", currentOrder === "asc" ? "desc" : "asc");
    } else {
      // New Sort
      params.set("sort", field);
      params.set("order", "asc");
    }
    router.push(`?${params.toString()}`);
  };

  // Pagination Handler
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.last_page) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  // Render Sort Icon
  const renderSortIcon = (field: string) => {
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";

    if (sort !== field)
      return <ChevronsUpDown size={14} className="text-slate-400" />;
    if (order === "asc") return <ArrowUp size={14} className="text-blue-500" />;
    return <ArrowDown size={14} className="text-blue-500" />;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Blog Posts
        </h2>
        <Link
          href="/dashboard/posts/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          Add Post
        </Link>
      </div>

      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search Bar */}
        <div className="mb-5 relative">
          <input
            type="text"
            placeholder="Search posts by title..."
            className="w-full md:w-80 pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={18}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th
                  className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors select-none group"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-1">
                    Title {renderSortIcon("title")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors select-none group"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center gap-1">
                    Category {renderSortIcon("category")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors select-none group"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Status {renderSortIcon("status")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors select-none group"
                  onClick={() => handleSort("author")}
                >
                  <div className="flex items-center gap-1">
                    Author {renderSortIcon("author")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors select-none group"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center gap-1">
                    Created At {renderSortIcon("created_at")}
                  </div>
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {post.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        /{post.slug}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {post.categories && post.categories.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
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
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
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
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {post.status.charAt(0).toUpperCase() +
                          post.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {post.author?.avatar_url ? (
                          <img
                            src={post.author.avatar_url}
                            alt={post.author.full_name || ""}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700" />
                        )}
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {post.author?.full_name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">
                      {format(new Date(post.created_at), "dd MMM yyyy")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/posts/${post.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
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
                        <p className="text-xs mt-1">
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
        <div className="mt-5 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
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
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 px-2">
              Page {meta.page} of {meta.last_page}
            </span>
            <button
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= meta.last_page}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
