"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { incrementView } from "@/services/actions";

export default function ViewCounter({
  slug,
  initialViews = 0,
  trackView = false,
}: {
  slug: string;
  initialViews?: number;
  trackView?: boolean;
}) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    if (trackView) {
      // Increment view count on mount
      incrementView(slug);
      // Optimistically update view count
      setViews((prev) => prev + 1);
    }
  }, [slug, trackView]);

  return (
    <span className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
      <Eye className="w-4 h-4 mr-1.5" />
      {views.toLocaleString()} views
    </span>
  );
}
