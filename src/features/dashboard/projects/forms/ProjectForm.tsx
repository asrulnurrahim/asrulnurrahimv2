"use client";

import React, { useState, useMemo } from "react";
import { Loader2, Save, ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ProjectWithTechnologies } from "@/features/projects/types";
import {
  useCreateProject,
  useUpdateProject,
} from "../hooks/useProjectMutations";
import { useTechnologies } from "../hooks/useTechnologies";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormValues } from "../schemas/project";
import { uploadThumbnailAction } from "../actions/upload";

// Ideally we should move EditorClient to a shared location, but consuming it from posts for now
import EditorClient from "../../posts/components/posts/EditorClient";
import { env } from "@/lib/env/client";

interface ProjectFormProps {
  project?: ProjectWithTechnologies;
  isEditing?: boolean;
}

export function ProjectForm({ project, isEditing = false }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const { data: technologies = [], isLoading: loadingTech } = useTechnologies();

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  // Initialize form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      slug: project?.slug || "",
      summary: project?.summary || "",
      status: project?.status || "draft",
      thumbnail: project?.thumbnail || "",
      technologies: project?.technologies?.map((t) => t.id) || [],
      is_featured: project?.is_featured || false,
      repo_url: project?.repo_url || "",
      live_url: project?.live_url || "",
      problem: project?.problem || "",
      solution: project?.solution || "",
      result: project?.result || "",
      learnings: project?.learnings || "",
      seo_title: project?.seo_title || "",
      seo_description: project?.seo_description || "",
      thumbnail_path: project?.thumbnail_path || "",
    },
  });

  const currentTitle = watch("title");
  const currentThumbnail = watch("thumbnail");
  const thumbnailPath = watch("thumbnail_path");
  const selectedTechnologies = watch("technologies") || [];

  // Derive display URL for thumbnail
  const displayThumbnail = useMemo(() => {
    if (currentThumbnail) return currentThumbnail;
    if (thumbnailPath) {
      const { data } = supabase.storage
        .from("projects-thumbnails")
        .getPublicUrl(thumbnailPath);
      return data.publicUrl;
    }
    return "";
  }, [currentThumbnail, thumbnailPath, supabase]);

  // Auto-generate slug
  React.useEffect(() => {
    if (!isEditing && currentTitle) {
      const slug = currentTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [currentTitle, isEditing, setValue]);

  const handleTechnologyToggle = (techId: string) => {
    const updated = selectedTechnologies.includes(techId)
      ? selectedTechnologies.filter((id) => id !== techId)
      : [...selectedTechnologies, techId];
    setValue("technologies", updated, { shouldValidate: true });
  };

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploadingThumbnail(true);
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadThumbnailAction(formData);

      if (res.error) throw new Error(res.error);
      if (res.data) {
        setValue("thumbnail_path", res.data, { shouldValidate: true });
        // Clear legacy URL if path is set
        setValue("thumbnail", "", { shouldValidate: true });
      }
    } catch (error: unknown) {
      console.error("Error uploading thumbnail:", error);
      alert(
        error instanceof Error ? error.message : "Error uploading thumbnail",
      );
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const removeThumbnail = () => {
    setValue("thumbnail", "", { shouldValidate: true });
    setValue("thumbnail_path", "", { shouldValidate: true });
  };

  const onSubmit = async (data: ProjectFormValues) => {
    setLoading(true);
    try {
      if (isEditing && project) {
        await updateProjectMutation.mutateAsync({
          id: project.id,
          data: data,
        });
      } else {
        await createProjectMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error("Error submitting project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/projects"
            className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft
              size={20}
              className="text-slate-600 dark:text-slate-400"
            />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isEditing ? "Edit Project" : "Create New Project"}
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/projects"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={
              loading ||
              createProjectMutation.isPending ||
              updateProjectMutation.isPending
            }
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {(loading ||
              createProjectMutation.isPending ||
              updateProjectMutation.isPending) && (
              <Loader2 className="animate-spin" size={16} />
            )}
            <Save size={16} />
            {isEditing ? "Update Project" : "Create Project"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Basic Information
            </h3>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Project Title
              </label>
              <input
                type="text"
                {...register("title")}
                className={`w-full rounded-lg border bg-slate-50 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 ${
                  errors.title
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-500 dark:border-slate-700"
                }`}
                placeholder="Enter project title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
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
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Summary
              </label>
              <textarea
                rows={3}
                {...register("summary")}
                className={`w-full resize-none rounded-lg border bg-slate-50 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 ${
                  errors.summary
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-500 dark:border-slate-700"
                }`}
                placeholder="Brief summary of the project"
              />
              {errors.summary && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.summary.message}
                </p>
              )}
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Media
            </h3>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Thumbnail
              </label>
              <div className="space-y-4">
                {displayThumbnail ? (
                  <div className="group relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="relative h-full w-full">
                      <Image
                        src={displayThumbnail}
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
          </div>

          {/* Case Study Details */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Case Study Details
            </h3>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                The Problem
              </label>
              <div className="min-h-[200px]">
                <EditorClient
                  apiKey={env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  value={watch("problem") || ""}
                  onChange={(content) =>
                    setValue("problem", content, { shouldValidate: true })
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                The Solution
              </label>
              <div className="min-h-[200px]">
                <EditorClient
                  apiKey={env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  value={watch("solution") || ""}
                  onChange={(content) =>
                    setValue("solution", content, { shouldValidate: true })
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                The Result
              </label>
              <div className="min-h-[200px]">
                <EditorClient
                  apiKey={env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  value={watch("result") || ""}
                  onChange={(content) =>
                    setValue("result", content, { shouldValidate: true })
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Learnings
              </label>
              <div className="min-h-[200px]">
                <EditorClient
                  apiKey={env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  value={watch("learnings") || ""}
                  onChange={(content) =>
                    setValue("learnings", content, { shouldValidate: true })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                {...register("is_featured")}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="is_featured"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Feature this project
              </label>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Technologies
              </label>
              <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                {loadingTech ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  </div>
                ) : technologies.length === 0 ? (
                  <p className="py-2 text-center text-sm text-slate-500">
                    No technologies found.
                  </p>
                ) : (
                  technologies.map((tech) => (
                    <label
                      key={tech.id}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-1 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTechnologies.includes(tech.id)}
                        onChange={() => handleTechnologyToggle(tech.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {tech.name}
                      </span>
                    </label>
                  ))
                )}
              </div>
              {errors.technologies && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.technologies.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Live URL
              </label>
              <input
                type="url"
                {...register("live_url")}
                className={`w-full rounded-lg border bg-slate-50 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 ${
                  errors.live_url
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-500 dark:border-slate-700"
                }`}
                placeholder="https://example.com"
              />
              {errors.live_url && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.live_url.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Repository URL
              </label>
              <input
                type="url"
                {...register("repo_url")}
                className={`w-full rounded-lg border bg-slate-50 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 ${
                  errors.repo_url
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-500 dark:border-slate-700"
                }`}
                placeholder="https://github.com/..."
              />
              {errors.repo_url && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.repo_url.message}
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
      </div>
    </form>
  );
}
