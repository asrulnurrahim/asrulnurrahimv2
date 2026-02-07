import React from "react";
import { PostsTable } from "@/components/dashboard/posts/PostsTable";
import { getDashboardPosts } from "@/services/db";

export const revalidate = 0; // Ensure dynamic data

export default async function PostsPage() {
  const posts = await getDashboardPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <PostsTable posts={posts as any} />
    </div>
  );
}
