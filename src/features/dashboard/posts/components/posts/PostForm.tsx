"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Post, Category, Tag } from "@/lib/types";
import EditorClient from "./EditorClient";
import { uploadImage } from "@/lib/supabase/upload-image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostFormValues } from "@/lib/validation";
import { env } from "@/lib/env/client";
import { useCreatePost, useUpdatePost } from "../../hooks/usePostMutations";

interface PostFormProps {
  post?: Post;
  isEditing?: boolean;
}

export function PostForm({ post, isEditing = false }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = React.useMemo(() => createClient(), []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();

  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  // Initialize form with default values
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      status: post?.status || "draft",
      seo_title: post?.seo_title || "",
      seo_description: post?.seo_description || "",
      thumbnail: post?.thumbnail || "",
      categories:
        post?.categories?.map((c) => c.id) ||
        (post?.category?.id ? [post.category.id] : []),
      tags: post?.tags?.map((t) => t.id) || [],
    },
  });

  // Watch fields for logic (e.g. slug generation, categories display)
  const currentTitle = watch("title");
  const currentThumbnail = watch("thumbnail");
  const currentContent = watch("content");
  const selectedCategories = watch("categories");
  const selectedTags = watch("tags");

  React.useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      if (data) setCategories(data);
    };

    const fetchTags = async () => {
      const { data } = await supabase.from("tags").select("*");
      if (data) setTags(data);
    };

    fetchCategories();
    fetchTags();
  }, [supabase]);

  // Auto-generate slug from title if creating new post
  React.useEffect(() => {
    if (!isEditing && currentTitle) {
      const slug = currentTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [currentTitle, isEditing, setValue]);

  const handleCategoryToggle = (categoryId: string) => {
    const current = selectedCategories || [];
    const updated = current.includes(categoryId)
      ? current.filter((id: string) => id !== categoryId)
      : [...current, categoryId];
    setValue("categories", updated, { shouldValidate: true });
  };

  const handleTagToggle = (tagId: string) => {
    const current = selectedTags || [];
    const updated = current.includes(tagId)
      ? current.filter((id: string) => id !== tagId)
      : [...current, tagId];
    setValue("tags", updated, { shouldValidate: true });
  };

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploadingThumbnail(true);
    try {
      const file = e.target.files[0];
      const url = await uploadImage(file, "images", supabase);
      setValue("thumbnail", url, { shouldValidate: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Error uploading thumbnail: " + error.message);
      } else {
        alert("Error uploading thumbnail: Unknown error");
      }
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const removeThumbnail = () => {
    setValue("thumbnail", "", { shouldValidate: true });
  };

  const onSubmit = async (data: PostFormValues) => {
    setLoading(true);

    try {
      // Determine published_at
      let published_at = post?.published_at;

      if (data.status === "published") {
        if (!published_at) {
          published_at = new Date().toISOString();
        }
      } else {
        published_at = null;
      }

      const postPayload = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        status: data.status,
        seo_title: data.seo_title,
        seo_description: data.seo_description,
        thumbnail: data.thumbnail,
        published_at: published_at,
      };

      if (isEditing && post) {
        // Update Post
        await updatePostMutation.mutateAsync({
          id: post.id,
          post: postPayload,
          categoryIds: data.categories,
          tagIds: data.tags,
        });
      } else {
        // Create Post
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("You must be logged in to create a post");
        }

        await createPostMutation.mutateAsync({
          post: {
            ...postPayload,
            author_id: user.id,
          },
          categoryIds: data.categories,
          tagIds: data.tags,
        });
      }

      router.push("/dashboard/posts");
      // router.refresh() is handled in mutations onSuccess
    } catch (error: unknown) {
      console.error("Error saving post:", error);
      if (error instanceof Error) {
        alert("Error saving post: " + error.message);
      } else {
        alert("Error saving post: Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/posts"
            className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
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
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            <Save size={16} />
            {isEditing ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Post Title
              </label>
              <input
                type="text"
                {...register("title")}
                className={`w-full rounded-lg border bg-slate-50 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 ${
                  errors.title
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-500 dark:border-slate-700"
                }`}
                placeholder="Enter post title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Thumbnail
              </label>
              <div className="space-y-4">
                {currentThumbnail ? (
                  <div className="group relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="relative h-full w-full">
                      <Image
                        src={currentThumbnail}
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="rounded-full bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-slate-500 transition-colors hover:border-blue-500 hover:text-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                    {uploadingThumbnail ? (
                      <Loader2 className="mb-2 h-10 w-10 animate-spin" />
                    ) : (
                      <ImageIcon className="mb-2 h-10 w-10" />
                    )}
                    <span className="text-sm font-medium">
                      {uploadingThumbnail
                        ? "Uploading..."
                        : "Click to upload thumbnail"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="absolute inset-0 cursor-pointer opacity-0"
                      disabled={uploadingThumbnail}
                    />
                  </div>
                )}
                <p className="text-xs text-slate-500">
                  Recommended size: 1200x630px (16:9 aspect ratio)
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Content
              </label>
              <div className="min-h-[400px]">
                <EditorClient
                  apiKey={env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  value={currentContent}
                  onChange={(content) =>
                    setValue("content", content, { shouldValidate: true })
                  }
                />
              </div>
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.content.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              SEO Settings
            </h3>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                SEO Title
              </label>
              <input
                type="text"
                {...register("seo_title")}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800"
                placeholder="Meta title"
              />
              {errors.seo_title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.seo_title.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                SEO Description
              </label>
              <textarea
                rows={3}
                {...register("seo_description")}
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800"
                placeholder="Meta description"
              />
              {errors.seo_description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.seo_description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Publishing
            </h3>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Categories
              </label>
              <div
                className={`max-h-60 space-y-2 overflow-y-auto rounded-lg border bg-slate-50 p-3 dark:bg-slate-800 ${
                  errors.categories
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories?.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
              {errors.categories && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.categories.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Tags
              </label>
              <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                {tags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags?.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {tag.name}
                    </span>
                  </label>
                ))}
                {tags.length === 0 && (
                  <p className="text-xs text-slate-500 italic">
                    No tags found. Create one in Tags page.
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Slug
              </label>
              <input
                type="text"
                {...register("slug")}
                className={`w-full rounded-lg border bg-slate-50 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 ${
                  errors.slug
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-500 dark:border-slate-700"
                }`}
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.slug.message}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                URL-friendly version of the title
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Excerpt
            </h3>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Short Summary
              </label>
              <textarea
                rows={4}
                {...register("excerpt")}
                className={`w-full resize-none rounded-lg border bg-slate-50 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 ${
                  errors.excerpt
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-500 dark:border-slate-700"
                }`}
                placeholder="Brief summary for list view"
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.excerpt.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
