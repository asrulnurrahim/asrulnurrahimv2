"use client";

import dynamic from "next/dynamic";
import React from "react";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] w-full animate-pulse items-center justify-center rounded-lg bg-slate-50 text-slate-400 dark:bg-slate-800">
      Loading editor...
    </div>
  ),
});

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
