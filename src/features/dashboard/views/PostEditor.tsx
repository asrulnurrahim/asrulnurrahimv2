import React from "react";
import { PostForm } from "../components/posts/PostForm";
import { getPost } from "@/features/blog/services";
import { Post } from "@/lib/types";

interface PostEditorProps {
  postId?: string;
}

export async function PostEditor({ postId }: PostEditorProps) {
  let post = null;

  if (postId) {
    post = await getPost(postId);
    if (!post) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            Post not found
          </div>
        </div>
      );
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PostForm post={post as unknown as Post} isEditing={!!postId} />
    </div>
  );
}
