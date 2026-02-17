import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters."),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be in kebab-case (lowercase, numbers, and hyphens only).",
    ),
  summary: z
    .string()
    .min(1, "Summary is required")
    .max(500, "Summary must not exceed 500 characters."),
  live_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  repo_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  technologies: z
    .array(z.string().uuid("Invalid technology ID"))
    .min(1, "Please select at least one technology."),
  status: z.enum(["draft", "published"]),
  is_featured: z.boolean(),
  // Preservation of existing case study fields (optional)
  thumbnail: z.string().optional().or(z.literal("")),
  thumbnail_path: z.string().optional().or(z.literal("")),
  problem: z.string().optional().or(z.literal("")),
  solution: z.string().optional().or(z.literal("")),
  result: z.string().optional().or(z.literal("")),
  learnings: z.string().optional().or(z.literal("")),
  seo_title: z.string().max(60).optional().or(z.literal("")),
  seo_description: z.string().max(160).optional().or(z.literal("")),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
