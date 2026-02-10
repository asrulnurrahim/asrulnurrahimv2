"use client";

import { useState, useRef } from "react";
import { createTag, deleteTag, updateTag } from "@/services/actions";
import { Tag } from "@/lib/types";
import { Trash2, Edit2, Check, X, Loader2, Tag as TagIcon } from "lucide-react";

export default function TagManager({ tags }: { tags: Tag[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (formData: FormData) => {
    setIsCreating(true);
    try {
      const res = await createTag(null, formData);
      if (res.message !== "Success") {
        alert(res.message);
      } else {
        formRef.current?.reset();
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    setLoadingId(id);
    try {
      const res = await deleteTag(id);
      if (res.message !== "Success") alert(res.message);
    } finally {
      setLoadingId(null);
    }
  };

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditName(tag.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setLoadingId(editingId);
    try {
      const formData = new FormData();
      formData.append("id", editingId);
      formData.append("name", editName);

      const res = await updateTag(null, formData);
      if (res.message !== "Success") {
        alert(res.message);
      } else {
        setEditingId(null);
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <TagIcon className="w-5 h-5" />
          Add New Tag
        </h3>
        <form ref={formRef} action={handleCreate} className="flex gap-4">
          <input
            type="text"
            name="name"
            required
            placeholder="Tag name (e.g. Next.js, React)"
            className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <button
            type="submit"
            disabled={isCreating}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Add Tag"
            )}
          </button>
        </form>
      </div>

      {/* Tag List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Existing Tags ({tags.length})
          </h3>
        </div>

        {tags.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            No tags found. Create one above!
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex-1">
                  {editingId === tag.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={handleUpdate}
                        disabled={loadingId === tag.id}
                        className="p-1.5 bg-green-100 text-green-600 rounded-md hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                      >
                        {loadingId === tag.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={loadingId === tag.id}
                        className="p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        {tag.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono">
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
                        className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id)}
                        disabled={loadingId === tag.id}
                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        {loadingId === tag.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
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
