import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TagManagerComponent from "./tags/TagManager";
import { Tag } from "@/lib/types";

interface TagManagerProps {
  tags: Tag[];
}

export function TagManager({ tags }: TagManagerProps) {
  return (
    <div className="mx-auto max-w-4xl p-6 md:p-8">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Manage Tags
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Create, edit, and delete tags for your blog posts.
          </p>
        </div>
      </div>

      <TagManagerComponent tags={tags} />
    </div>
  );
}
