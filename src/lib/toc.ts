export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Processes HTML content to extract headings and inject IDs for TOC.
 * Uses Regex to avoid heavy DOM parsing libraries on the server.
 *
 * @param html The raw HTML content string
 * @returns Object containing the modified HTML and extracted TOC items
 */
export function processContent(html: string): {
  content: string;
  toc: TocItem[];
} {
  const toc: TocItem[] = [];
  const headingRegex = /<(h[2-4])(?:\s+[^>]*)?>(.*?)<\/\1>/gi;

  // Use a counter to ensure unique IDs if headings are duplicate
  const slugCounts: Record<string, number> = {};

  const processedContent = html.replace(headingRegex, (match, tag, content) => {
    // Remove HTML tags from content to get plain text
    const cleanText = content.replace(/<[^>]*>/g, "").trim();

    // Create formatting-friendly slug
    let slug = cleanText
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special chars
      .replace(/\s+/g, "-"); // Replace spaces with hyphens

    // Handle empty slugs or duplicates
    if (!slug) slug = "heading";

    if (slugCounts[slug]) {
      slugCounts[slug]++;
      slug = `${slug}-${slugCounts[slug]}`;
    } else {
      slugCounts[slug] = 1;
    }

    const level = parseInt(tag.charAt(1));

    toc.push({ id: slug, text: cleanText, level });

    // Return heading with injected ID. Preserves existing attributes if any (though regex is simple).
    // We reconstruct the tag to ensure ID is first and clean.
    // Note: This regex replacement assumes simple standard headings.
    return `<${tag} id="${slug}">${content}</${tag}>`;
  });

  return { content: processedContent, toc };
}
