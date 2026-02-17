import { getTags } from "@/features/blog/services";
import { TagManager } from "@/features/dashboard/posts/components/TagManager";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const tags = await getTags();

  return <TagManager tags={tags} />;
}
