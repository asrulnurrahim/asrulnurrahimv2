"use client";

import dynamic from "next/dynamic";
import React from "react";

const RichTextEditor = dynamic(
  () => import("@/components/dashboard/posts/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full bg-slate-50 dark:bg-slate-800 rounded-lg animate-pulse flex items-center justify-center text-slate-400">
        Loading editor...
      </div>
    ),
  },
);

interface EditorClientProps {
  apiKey?: string;
  value: string;
  onChange: (content: string) => void;
}

export default function EditorClient({
  apiKey,
  value,
  onChange,
}: EditorClientProps) {
  return <RichTextEditor apiKey={apiKey} value={value} onChange={onChange} />;
}
