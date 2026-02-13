"use client";

import { useEffect, useRef, useState } from "react";
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
  const [copied, setCopied] = useState(false);

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
      className={`flex items-center gap-2 p-2 rounded-lg backdrop-blur-md border transition-all duration-200 ${
        copied
          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
          : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
      }`}
      aria-label="Copy code"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>Copy code</span>
        </>
      )}
    </button>
  );
}
