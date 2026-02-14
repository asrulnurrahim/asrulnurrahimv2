"use client";

import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  apiKey?: string;
  height?: number;
}

import { useTheme } from "next-themes";
import { uploadImage } from "@/lib/supabase/upload-image";
import { createClient } from "@/lib/supabase/client";

export default function RichTextEditor({
  value,
  onChange,
  apiKey,
  height = 500,
}: RichTextEditorProps) {
  const editorRef = useRef<Editor | null>(null);
  const { resolvedTheme } = useTheme();

  // Determine if dark mode is active
  const isDark = resolvedTheme === "dark";
  const supabase = React.useMemo(() => createClient(), []);

  return (
    <Editor
      apiKey={apiKey}
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={(content) => onChange(content)}
      // Force re-render when theme changes to reload skin
      key={isDark ? "dark" : "light"}
      init={{
        height: height,
        menubar: true, // Enable menubar for full experience
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
          "directionality",
          "emoticons",
          "visualchars",
          "nonbreaking",
          "pagebreak",
          "quickbars",
        ],
        toolbar:
          "undo redo | blocks fontfamily fontsize | " +
          "bold italic underline strikethrough | link image media table | " +
          "align lineheight | numlist bullist indent outdent | " +
          "emoticons charmap | removeformat | fullscreen preview print | code help",
        content_style: "body { font-family:Inter,sans-serif; font-size:14px }",
        // Dynamic skin and content_css based on theme
        skin: isDark ? "oxide-dark" : "oxide",
        content_css: isDark ? "dark" : "default",
        promotion: false, // Hide the "Upgrade" promotion button
        quickbars_selection_toolbar:
          "bold italic | quicklink h2 h3 blockquote quickimage quicktable",

        // Image upload handler
        // eslint-disable-next-line
        images_upload_handler: (blobInfo: any, _progress: any) => {
          return new Promise((resolve, reject) => {
            const blob = blobInfo.blob();
            const file = new File([blob], blobInfo.filename(), {
              type: blob.type,
            });

            uploadImage(file, "images", supabase)
              .then((url) => {
                resolve(url);
              })
              .catch((error: unknown) => {
                if (error instanceof Error) {
                  reject(error.message);
                } else {
                  reject("Unknown error");
                }
              });
          });
        },
      }}
    />
  );
}
