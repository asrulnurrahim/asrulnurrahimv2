import { z } from "zod";

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full Name must be at least 2 characters.")
    .max(50, "Full Name must not exceed 50 characters."),
  headline: z
    .string()
    .max(50, "Headline must not exceed 50 characters.")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(160, "Bio must not exceed 160 characters.")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const postSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(100, "Title must not exceed 100 characters."),
  slug: z
    .string()
    .min(5, "Slug must be at least 5 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens.",
    ),
  content: z.string().min(1, "Content is required."),
  excerpt: z
    .string()
    .max(300, "Excerpt must not exceed 300 characters.")
    .optional()
    .or(z.literal("")),
  thumbnail: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  seo_title: z
    .string()
    .max(60, "SEO Title must not exceed 60 characters.")
    .optional()
    .or(z.literal("")),
  seo_description: z
    .string()
    .max(160, "SEO Description must not exceed 160 characters.")
    .optional()
    .or(z.literal("")),
  categories: z
    .array(z.string())
    .min(1, "Please select at least one category."),
  tags: z.array(z.string()).optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;

export const publicPostsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
});

export const dashboardPostsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  query: z.string().optional(),
  sort: z.string().default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
  status: z.enum(["draft", "published", "all"]).default("all"),
});

export const deletePostSchema = z.object({
  id: z.string().uuid("Invalid Post ID"),
});
