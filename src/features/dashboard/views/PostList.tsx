"use client";

import React, { useState, useCallback } from "react";
import { PostsTable } from "../components/posts/PostsTable";
import { useDashboardPosts, useDeletePost } from "../hooks/useDashboardPosts";
import { Post, DashboardPostsOptions } from "@/features/blog/types";

interface PostListProps {
  initialData: {
    data: Post[];
    meta: {
      total: number;
      page: number;
      last_page: number;
    };
  };
  initialOptions: DashboardPostsOptions;
}

export function PostList({ initialData, initialOptions }: PostListProps) {
  const [options, setOptions] = useState<DashboardPostsOptions>(initialOptions);

  // Only use initialData if the current options match the initial options
  // We use reference equality as a heuristic because we start with initialOptions
  const queryInitialData = options === initialOptions ? initialData : undefined;

  const { data, isLoading } = useDashboardPosts(options, queryInitialData);

  const handlePageChange = useCallback((newPage: number) => {
    setOptions((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleSearch = useCallback((query: string) => {
    setOptions((prev) => ({ ...prev, query, page: 1 }));
  }, []);

  const handleSort = useCallback((field: string) => {
    setOptions((prev) => {
      const isAsc = prev.sort === field && prev.order === "asc";
      return {
        ...prev,
        sort: field,
        order: isAsc ? "desc" : "asc",
      };
    });
  }, []); // Added closing bracket for callback dependency array

  const { mutate: deletePost } = useDeletePost();

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm("Are you sure you want to delete this post?")) {
        deletePost(id);
      }
    },
    [deletePost],
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <PostsTable
        posts={data?.data || []}
        meta={data?.meta || { total: 0, page: 1, last_page: 1 }}
        isLoading={isLoading}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onSort={handleSort}
        currentOptions={options}
      />
    </div>
  );
}
