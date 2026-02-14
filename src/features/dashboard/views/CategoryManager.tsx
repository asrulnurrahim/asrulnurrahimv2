"use client";

import { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categories";
import { Category } from "@/lib/types";
import { Plus, Edit, Trash, X, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null); // ID of category being edited
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editColor, setEditColor] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newColor, setNewColor] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newName || !newSlug) return;
    try {
      await createCategory({
        name: newName,
        slug: newSlug,
        description: newDescription,
        color: newColor,
      });
      setNewName("");
      setNewSlug("");
      setNewDescription("");
      setNewColor("");
      setIsCreating(false);
      fetchCategories();
      router.refresh();
    } catch (error) {
      console.error("Failed to create category:", error);
      alert("Failed to create category");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName || !editSlug) return;
    try {
      await updateCategory(id, {
        name: editName,
        slug: editSlug,
        description: editDescription,
        color: editColor,
      });
      setIsEditing(null);
      fetchCategories();
      router.refresh();
    } catch (error) {
      console.error("Failed to update category:", error);
      alert("Failed to update category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      fetchCategories();
      router.refresh();
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category");
    }
  };

  const startEditing = (category: Category) => {
    setIsEditing(category.id);
    setEditName(category.name);
    setEditSlug(category.slug);
    setEditDescription(category.description || "");
    setEditColor(category.color || "");
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage your blog post categories.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-slate-900">
        {/* Creation Form */}
        {isCreating && (
          <div className="border-b border-gray-100 bg-blue-50/50 p-4 dark:border-gray-800 dark:bg-blue-900/10">
            <div className="flex flex-col items-end gap-4 md:flex-row">
              <div className="w-full flex-1">
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setNewSlug(generateSlug(e.target.value));
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-slate-800"
                  placeholder="Category Name"
                />
              </div>
              <div className="w-full flex-1">
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Slug
                </label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-slate-800"
                  placeholder="category-slug"
                />
              </div>
              <div className="w-full flex-1">
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Description
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-slate-800"
                  placeholder="Short description..."
                />
              </div>
              <div className="w-24">
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newColor || "#000000"}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="h-9 w-9 cursor-pointer rounded border border-gray-200 bg-white p-0.5 dark:border-gray-700 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreate}
                  className="rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="rounded-lg bg-gray-200 p-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No categories found.
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center justify-between gap-4 p-4 transition-colors hover:bg-gray-50 md:flex-row dark:hover:bg-slate-800/50"
              >
                {isEditing === category.id ? (
                  <div className="flex w-full items-center gap-4">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => {
                        setEditName(e.target.value);
                        setEditSlug(generateSlug(e.target.value));
                      }}
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-slate-800"
                    />

                    <input
                      type="text"
                      value={editSlug}
                      onChange={(e) => setEditSlug(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-slate-800"
                    />
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description"
                      className="flex-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-slate-800"
                    />
                    <input
                      type="color"
                      value={editColor || "#000000"}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="h-9 w-9 shrink-0 cursor-pointer rounded border border-gray-200 bg-white p-0.5 dark:border-gray-700 dark:bg-slate-800"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdate(category.id)}
                        className="rounded-lg bg-emerald-600 p-2 text-white transition-colors hover:bg-emerald-700"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setIsEditing(null)}
                        className="rounded-lg bg-gray-200 p-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs dark:bg-gray-800">
                          {category.slug}
                        </span>
                        <span>{category.posts?.[0]?.count || 0} posts</span>
                        {category.color && (
                          <span
                            className="h-4 w-4 rounded-full border border-gray-200 dark:border-gray-700"
                            style={{ backgroundColor: category.color }}
                            title={category.color}
                          />
                        )}
                        {category.description && (
                          <span
                            className="max-w-[200px] truncate text-xs text-gray-400"
                            title={category.description}
                          >
                            {category.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditing(category)}
                        className="p-2 text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-gray-500 transition-colors hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
