"use client";

import { useState } from "react";
import { useTags } from "../../hooks/useTags";
import { Tag } from "@/lib/types";
import { Trash2, Edit2, Check, X, Loader2, Tag as TagIcon } from "lucide-react";

export default function TagManager({}: { tags?: Tag[] }) {
  // Use React Query hook
  const {
    tags,
    isLoading,
    createTag,
    updateTag,
    deleteTag,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTags();

  // Local state for UI
  const [loadingId, setLoadingId] = useState<string | null>(null); // For delete/update loading indicators specific to an item
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  // Creation state
  const [newSlug, setNewSlug] = useState("");
  const [newName, setNewName] = useState("");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    createTag(
      { name: newName, slug: newSlug || generateSlug(newName) },
      {
        onSuccess: () => {
          setNewName("");
          setNewSlug("");
        },
        onError: (error) => {
          alert(`Error: ${error.message}`);
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    setLoadingId(id);

    deleteTag(id, {
      onSuccess: () => setLoadingId(null),
      onError: (error) => {
        setLoadingId(null);
        alert(`Error: ${error.message}`);
      },
    });
  };

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditName(tag.name);
    setEditSlug(tag.slug);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditSlug("");
  };

  const handleUpdate = () => {
    if (!editingId) return;
    setLoadingId(editingId);

    updateTag(
      {
        id: editingId,
        name: editName,
        slug: editSlug || generateSlug(editName),
      },
      {
        onSuccess: () => {
          setEditingId(null);
          setLoadingId(null);
        },
        onError: (error) => {
          setLoadingId(null);
          alert(`Error: ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Create Form */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <TagIcon className="h-5 w-5" />
          Add New Tag
        </h3>
        <form
          onSubmit={handleCreate}
          className="flex w-full flex-col gap-4 md:flex-row"
        >
          <div className="flex-1 space-y-2">
            <input
              type="text"
              name="name"
              required
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setNewSlug(generateSlug(e.target.value));
              }}
              placeholder="Tag name (e.g. Next.js)"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div className="flex-1 space-y-2">
            <input
              type="text"
              name="slug"
              required
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="slug-url"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 font-mono text-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Add Tag"
            )}
          </button>
        </form>
      </div>

      {/* Tag List */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-6 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Existing Tags ({tags.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-2">Loading tags...</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            No tags found. Create one above!
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {tags.map((tag: Tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="flex-1">
                  {editingId === tag.id ? (
                    <div className="flex w-full flex-col gap-2 pr-4 md:flex-row">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => {
                            setEditName(e.target.value);
                            setEditSlug(generateSlug(e.target.value));
                          }}
                          className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900"
                          autoFocus
                          placeholder="Name"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900"
                          placeholder="Slug"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleUpdate}
                          disabled={loadingId === tag.id || isUpdating}
                          className="rounded-md bg-green-100 p-1.5 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                        >
                          {loadingId === tag.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={loadingId === tag.id}
                          className="rounded-md bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        {tag.name}
                      </h4>
                      <p className="font-mono text-xs text-slate-500">
                        /{tag.slug}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!editingId && (
                    <>
                      <button
                        onClick={() => startEdit(tag)}
                        className="p-2 text-slate-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id)}
                        disabled={loadingId === tag.id || isDeleting}
                        className="p-2 text-slate-400 transition-colors hover:text-red-600 dark:hover:text-red-400"
                        title="Delete"
                      >
                        {loadingId === tag.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
