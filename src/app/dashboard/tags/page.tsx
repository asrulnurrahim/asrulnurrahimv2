import { getTags } from "@/services/db";
import TagManager from "@/components/dashboard/tags/TagManager";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Manage Tags
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Create, edit, and delete tags for your blog posts.
          </p>
        </div>
      </div>

      <TagManager tags={tags} />
    </div>
  );
}
