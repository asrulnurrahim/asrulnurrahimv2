import { PostForm } from "@/components/dashboard/posts/PostForm";
import { getPost } from "@/services/db";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PostForm post={post as any} isEditing />
    </div>
  );
}
