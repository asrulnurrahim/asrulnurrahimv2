import { createHighlighter } from "shiki";

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: [
        "typescript",
        "javascript",
        "tsx",
        "jsx",
        "css",
        "html",
        "json",
        "bash",
        "shell",
        "python",
        "markdown",
        "sql",
        "yaml",
      ],
    });
  }
  return highlighter;
}

export async function highlightContent(html: string): Promise<string> {
  const highlighter = await getHighlighter();

  // Regex to match <pre><code>...</code></pre> blocks
  // Captures:
  // 1. attributes on pre (optional)
  // 2. attributes on code (containing class="language-xyz")
  // 3. content inside code
  const codeBlockRegex = /<pre(.*?)><code(.*?)>([\s\S]*?)<\/code><\/pre>/g;

  return html.replace(
    codeBlockRegex,
    (match, preAttrs, codeAttrs, codeContent) => {
      // Decode HTML entities in code content (e.g., &lt; to <)
      const unescapedCode = codeContent
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      // Extract language from code attributes
      const langMatch = codeAttrs.match(
        /class=["'](?:language-|lang-)(\w+)["']/,
      );
      const lang = langMatch ? langMatch[1] : "text";

      try {
        const highlighted = highlighter.codeToHtml(unescapedCode, {
          lang,
          theme: "github-dark",
        });

        return `
          <div class="code-block relative my-6 overflow-hidden rounded-lg bg-[#0d1117] border border-gray-800 shadow-md">
            <div class="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-gray-800 text-xs text-gray-400 select-none">
              <span class="font-mono font-medium lowercase">${lang}</span>
              <div class="copy-btn-placeholder"></div>
            </div>
            <div class="relative overflow-x-auto p-4 [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-0 [&>pre]:!overflow-visible">
              ${highlighted}
            </div>
          </div>
        `;
      } catch (error) {
        console.error(`Failed to highlight code with lang ${lang}:`, error);
        return match; // Return original HTML on failure
      }
    },
  );
}
