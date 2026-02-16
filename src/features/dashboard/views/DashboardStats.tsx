"use client";

import React from "react";
import Link from "next/link";
import { FileText, FolderOpen, Eye, Rocket, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { DashboardStats as DashboardStatsType } from "../types";

export function DashboardStats({
  initialData,
}: {
  initialData: DashboardStatsType;
}) {
  const { data: stats } = useDashboardStats(initialData);

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Views"
          value={stats.counts.views.toLocaleString()}
          icon={<Eye className="h-6 w-6 text-white" />}
          gradient="bg-linear-to-br from-blue-500 to-indigo-600"
          shadow="shadow-blue-500/20"
        />
        <StatCard
          title="Published Posts"
          value={stats.counts.posts.toLocaleString()}
          icon={<FileText className="h-6 w-6 text-white" />}
          gradient="bg-linear-to-br from-emerald-500 to-teal-600"
          shadow="shadow-emerald-500/20"
        />
        <StatCard
          title="Active Projects"
          value={stats.counts.projects.toLocaleString()}
          icon={<Rocket className="h-6 w-6 text-white" />}
          gradient="bg-linear-to-br from-purple-500 to-pink-600"
          shadow="shadow-purple-500/20"
        />
        <StatCard
          title="Categories"
          value={stats.counts.categories.toLocaleString()}
          icon={<FolderOpen className="h-6 w-6 text-white" />}
          gradient="bg-linear-to-br from-amber-500 to-orange-600"
          shadow="shadow-amber-500/20"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-2xl border border-gray-100/50 bg-white shadow-xl shadow-gray-200/50 backdrop-blur-xl dark:border-gray-800/50 dark:bg-slate-900/50 dark:shadow-none">
        <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Recent Posts
          </h2>
          <Link
            href="/dashboard/posts"
            className="flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View All
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:bg-slate-800/50 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {stats.recentPosts.map((post) => (
                <tr
                  key={post.id}
                  className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {post.title}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        /{post.slug}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-6 py-4">
                    {post.categories && post.categories.length > 0 ? (
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor:
                            `${post.categories[0].color}20` || "#e2e8f0",
                          color: post.categories[0].color || "#64748b",
                        }}
                      >
                        {post.categories[0].name}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {post.views?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {post.published_at
                      ? format(new Date(post.published_at), "MMM d, yyyy")
                      : "-"}
                  </td>
                </tr>
              ))}
              {stats.recentPosts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    No posts found yet. Start writing your first article!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  gradient,
  shadow,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  shadow: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg ${shadow} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:shadow-none`}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg ${gradient} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
        >
          {icon}
        </div>
      </div>
      {/* Decorative background element */}
      <div
        className={`absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-10 blur-2xl ${gradient}`}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "published"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles}`}
    >
      {status}
    </span>
  );
}
