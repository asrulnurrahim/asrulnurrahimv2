"use client";

import { useState } from "react";
import {
  Linkedin,
  MessageCircle,
  Link as LinkIcon,
  Check,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  title: string;
  url: string;
  className?: string;
}

export default function ShareButtons({
  title,
  url,
  className,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const trackShare = (platform: string) => {
    // Custom event tracking logic (e.g., send to backend or console for now)
    console.log(`[Share] Article shared to ${platform}: ${title}`);
  };

  const shareLinks = [
    {
      name: "X",
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          {...props}
          className={cn("h-4 w-4", props.className)}
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title,
      )}&url=${encodeURIComponent(url)}`,
      color:
        "hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10",
      bgColor: "bg-black/5 text-black dark:bg-white/10 dark:text-white",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        url,
      )}&title=${encodeURIComponent(title)}`,
      color: "hover:text-[#0A66C2] hover:bg-[#0A66C2]/10",
      bgColor: "bg-[#0A66C2]/10 text-[#0A66C2]",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      color: "hover:text-[#25D366] hover:bg-[#25D366]/10",
      bgColor: "bg-[#25D366]/10 text-[#25D366]",
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackShare("Copy Link");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handleShare = (link: (typeof shareLinks)[0]) => {
    trackShare(link.name);
    window.open(link.url, "_blank", "width=600,height=400");
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        <Share2 className="h-4 w-4" />
        <span>Bagikan Artikel</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {shareLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => handleShare(link)}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 dark:border-gray-800 dark:bg-slate-900 dark:text-gray-300",
              link.color,
            )}
            aria-label={`Share on ${link.name}`}
          >
            <link.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{link.name}</span>
          </button>
        ))}

        <button
          onClick={handleCopy}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
            copied &&
              "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
          )}
          aria-label="Copy Link"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span className="hidden sm:inline">Tersalin</span>
            </>
          ) : (
            <>
              <LinkIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Salin Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
