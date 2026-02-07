"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Post, Category } from "@/lib/types";

// Dynamic import with SSR disabled to prevent hydration mismatch
const RichTextEditor = dynamic(
  () => import("@/components/dashboard/posts/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full bg-slate-50 dark:bg-slate-800 rounded-lg animate-pulse flex items-center justify-center text-slate-400">
        Loading editor...
      </div>
    ),
  },
);

interface PostFormProps {
  post?: Post;
  isEditing?: boolean;
}

export function PostForm({ post, isEditing = false }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    status: post?.status || "draft",
    seo_title: post?.seo_title || "",
    seo_description: post?.seo_description || "",
  });

  React.useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      if (data) setCategories(data);
    };
    fetchCategories();

    if (post?.categories) {
      setSelectedCategories(post.categories.map((c) => c.id));
    } else if (post?.category) {
      // Backward compatibility
      setSelectedCategories([post.category.id]);
    }
  }, [supabase, post]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !isEditing ? generateSlug(title) : prev.slug,
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let postId = post?.id;

      if (isEditing && post) {
        // Update Post
        const { error } = await supabase
          .from("posts")
          .update(formData)
          .eq("id", post.id);

        if (error) throw error;
      } else {
        // Create Post
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("You must be logged in to create a post");
        }

        const { data, error } = await supabase
          .from("posts")
          .insert([
            {
              ...formData,
              author_id: user.id,
            },
          ])
          .select()
          .single();

        if (error) throw error;
        postId = data.id;
      }

      if (postId) {
        // Manage Categories
        if (isEditing) {
          // Delete existing
          const { error: deleteError } = await supabase
            .from("post_categories")
            .delete()
            .eq("post_id", postId);
          if (deleteError) throw deleteError;
        }

        // Insert new
        if (selectedCategories.length > 0) {
          const postCategories = selectedCategories.map((catId) => ({
            post_id: postId,
            category_id: catId,
          }));

          const { error: insertError } = await supabase
            .from("post_categories")
            .insert(postCategories);
          if (insertError) throw insertError;
        }
      }

      router.push("/dashboard/posts");
      router.refresh();
    } catch (error: any) {
      console.error("Error saving post:", error);
      alert("Error saving post: " + (error?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/posts"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft
              size={20}
              className="text-slate-600 dark:text-slate-400"
            />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isEditing ? "Edit Post" : "Create New Post"}
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/posts"
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            <Save size={16} />
            {isEditing ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Post Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Content
              </label>
              <div className="min-h-[400px]">
                <RichTextEditor
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  value={formData.content}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, content }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              SEO Settings
            </h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo_title: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Meta title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                SEO Description
              </label>
              <textarea
                rows={3}
                value={formData.seo_description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo_description: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                placeholder="Meta description"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Publishing
            </h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as "draft" | "published",
                  }))
                }
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Categories
              </label>
              <div className="max-h-60 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-slate-800">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {category.name}
                    </span>
                  </label>
                ))}
                {categories.length === 0 && (
                  <p className="text-xs text-slate-500 italic">
                    No categories found. Create one in Categories page.
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Slug
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <p className="mt-1 text-xs text-slate-500">
                URL-friendly version of the title
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Excerpt
            </h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Short Summary
              </label>
              <textarea
                rows={4}
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                placeholder="Brief summary for list view"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
