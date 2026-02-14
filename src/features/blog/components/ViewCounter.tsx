"use client";

import { useEffect, useState, useRef } from "react";
import { Eye } from "lucide-react";
import { incrementView } from "@/features/blog/services/actions";

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
  const hasTracked = useRef(false);

  useEffect(() => {
    if (trackView && !hasTracked.current) {
      // Increment view count on mount
      incrementView(slug);
      // Optimistically update view count
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setViews((prev) => prev + 1);
      hasTracked.current = true;
    }
  }, [slug, trackView]);

  return (
    <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
      <Eye className="mr-1.5 h-4 w-4" />
      {views.toLocaleString()} views
    </span>
  );
}
