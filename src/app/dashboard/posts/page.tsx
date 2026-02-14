import React from "react";
import { PostList } from "@/features/dashboard/views";

export default function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
    order?: "asc" | "desc";
  }>;
}) {
  return <PostList searchParams={searchParams} />;
}
