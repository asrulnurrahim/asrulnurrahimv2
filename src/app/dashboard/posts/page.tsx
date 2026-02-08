import React from "react";
import { PostsTable } from "@/components/dashboard/posts/PostsTable";
import { getDashboardPosts } from "@/services/db";

export const revalidate = 0; // Ensure dynamic data

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
    order?: "asc" | "desc";
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params.q || "";
  const sort = params.sort || "created_at";
  const order = params.order || "desc";

  const { data: posts, meta } = await getDashboardPosts({
    page,
    limit: 10,
    query,
    sort,
    order,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <PostsTable posts={posts} meta={meta} />
    </div>
  );
}
