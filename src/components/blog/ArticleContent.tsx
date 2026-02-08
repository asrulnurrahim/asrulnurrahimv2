"use client";

import { useEffect, useRef } from "react";
import { Check, Copy } from "lucide-react";
import { createRoot } from "react-dom/client";

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Find all pre elements
    const preElements = containerRef.current.querySelectorAll("pre");

    preElements.forEach((pre) => {
      // Prevent double injection
      if (pre.querySelector(".copy-btn-container")) return;

      // Ensure pre is relative for absolute positioning of button
      // We enforce this via style to be safe, though CSS classes should handle it usually
      pre.style.position = "relative";

      // Create container for React root
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "copy-btn-container absolute top-3 right-3";
      pre.appendChild(buttonContainer);
      // Make pre a group so we can hover
      pre.classList.add("group");

      // We'll use a small React component for the button itself to handle state cleanly
      const root = createRoot(buttonContainer);
      root.render(<CopyButton text={pre.innerText} />);
    });
  }, [content]);

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: content }} />
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  // We need to access React.useState, but since this is inside a file module,
  // we should just use standard useState imported at top.
  // Wait, I can't use React.useState if I didn't import React as default or namespace.
  // I'll fix imports below.

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded-lg backdrop-blur-md border transition-all duration-200 ${
        copied
          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
          : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
      }`}
      aria-label="Copy code"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}
// Helper to fix the missing React import for the inline component
import React, { useState } from "react";
