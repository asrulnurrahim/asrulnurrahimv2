import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates reading time and word count for a given text or HTML content.
 * Standard reading speed: 200 words per minute.
 */
export function calculateReadingTime(content: string): {
  readingTime: number;
  wordCount: number;
} {
  const WORDS_PER_MINUTE = 200;

  // Strip HTML tags using regex - simple but sufficient for estimation
  const text = content.replace(/<[^>]*>/g, " ");

  // Count words by splitting by whitespace and filtering empty strings
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const readingTime = Math.ceil(wordCount / WORDS_PER_MINUTE);

  return { readingTime: Math.max(1, readingTime), wordCount };
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export function formatDate(date: string | number | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
