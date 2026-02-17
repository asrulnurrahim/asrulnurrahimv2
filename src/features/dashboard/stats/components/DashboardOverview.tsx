import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getDashboardStats } from "../services/stats";
import { DashboardStats } from "./DashboardStats";

export async function DashboardOverview() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 p-1">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:to-gray-400">
            Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back! Here&apos;s what&apos;s happening with your content
            today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/posts/create"
            className="group flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
            New Post
          </Link>
        </div>
      </div>

      {/* Real-time Stats Section */}
      <DashboardStats initialData={stats} />
    </div>
  );
}
