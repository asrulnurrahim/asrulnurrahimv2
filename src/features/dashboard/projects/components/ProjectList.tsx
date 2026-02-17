"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  ExternalLink,
  Github,
  Star,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { ProjectWithTechnologies } from "@/features/projects/types";
import {
  useDeleteProject,
  useTogglePublish,
  useToggleFeatured,
} from "../hooks/useProjectMutations";
import { getProjectThumbnailUrl } from "@/features/projects/utils/storage";

interface ProjectListProps {
  projects: ProjectWithTechnologies[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const deleteProjectMutation = useDeleteProject();
  const togglePublishMutation = useTogglePublish();
  const toggleFeaturedMutation = useToggleFeatured();

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(id);
    }
  };

  const handleTogglePublish = (id: string) => {
    togglePublishMutation.mutate(id);
  };

  const handleToggleFeatured = (id: string) => {
    toggleFeaturedMutation.mutate(id);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Projects
        </h2>
        <Link
          href="/dashboard/projects/create"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Project
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Search Bar */}
        <div className="relative mb-5">
          <input
            type="text"
            placeholder="Search projects by title..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 md:w-80 dark:border-slate-700 dark:bg-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute top-2.5 left-3 text-slate-400"
            size={18}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Project
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Featured
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Technologies
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Links
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-16 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                          {(() => {
                            const thumbnailUrl = getProjectThumbnailUrl(
                              project.thumbnail,
                              project.thumbnail_path,
                            );
                            return thumbnailUrl ? (
                              <Image
                                src={thumbnailUrl}
                                alt={project.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <span className="text-xs">No img</span>
                              </div>
                            );
                          })()}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {project.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            /{project.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublish(project.id)}
                        disabled={togglePublishMutation.isPending}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors hover:opacity-80 disabled:opacity-50 ${
                          project.status === "published"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                        title={
                          project.status === "published"
                            ? "Switch to Draft"
                            : "Switch to Published"
                        }
                      >
                        {togglePublishMutation.isPending &&
                        togglePublishMutation.variables === project.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : project.status === "published" ? (
                          <Eye size={12} />
                        ) : (
                          <EyeOff size={12} />
                        )}
                        {project.status.charAt(0).toUpperCase() +
                          project.status.slice(1)}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleFeatured(project.id)}
                        disabled={toggleFeaturedMutation.isPending}
                        className={`transition-colors hover:scale-110 disabled:opacity-50 ${
                          project.is_featured
                            ? "text-yellow-500"
                            : "text-slate-300 dark:text-slate-600"
                        }`}
                        title={
                          project.is_featured ? "Unfeature" : "Feature Project"
                        }
                      >
                        {toggleFeaturedMutation.isPending &&
                        toggleFeaturedMutation.variables === project.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Star
                            size={18}
                            fill={project.is_featured ? "currentColor" : "none"}
                          />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies?.slice(0, 3).map((tech) => (
                          <span
                            key={tech.id}
                            className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          >
                            {tech.name}
                          </span>
                        ))}
                        {(project.technologies?.length || 0) > 3 && (
                          <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            +{(project.technologies?.length || 0) - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-blue-500"
                            title="Live Demo"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        {project.repo_url && (
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            title="Repository"
                          >
                            <Github size={16} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {format(new Date(project.created_at), "dd MMM yyyy")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/projects/${project.id}/edit`}
                          className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id)}
                          disabled={deleteProjectMutation.isPending}
                          className="cursor-pointer rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                      <p className="text-sm">No projects found</p>
                      {searchTerm && (
                        <p className="mt-1 text-xs">
                          Try adjusting your search criteria
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
