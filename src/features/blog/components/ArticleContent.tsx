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

    // Find all code block wrappers
    const codeBlocks = containerRef.current.querySelectorAll(".code-block");

    codeBlocks.forEach((block) => {
      const placeholder = block.querySelector(".copy-btn-placeholder");
      if (!placeholder) return;

      // Prevent double injection
      if (placeholder.hasChildNodes()) return;

      // Find the code content for copying
      const codeElement = block.querySelector("code");
      const codeText = codeElement ? codeElement.innerText : "";

      const root = createRoot(placeholder);
      root.render(<CopyButton text={codeText} />);
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
      className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 transition-colors hover:text-white"
      aria-label="Copy code"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>Copy code</span>
        </>
      )}
    </button>
  );
}
