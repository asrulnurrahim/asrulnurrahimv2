import React from "react";
import { PostList } from "@/features/dashboard/posts/components/PostList";
import { getDashboardPosts } from "@/features/blog/services";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
    order?: "asc" | "desc";
    status?: "draft" | "published" | "all";
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params.q || "";
  const sort = params.sort || "created_at";
  const order = (params.order as "asc" | "desc") || "desc";
  const status = (params.status || "all") as "draft" | "published" | "all"; // Handle existing URL params if any

  const initialOptions = { page, limit: 10, query, sort, order, status };
  const initialData = await getDashboardPosts(initialOptions);

  return <PostList initialData={initialData} initialOptions={initialOptions} />;
}
