import { describe, it, expect } from "vitest";
import {
  profileSchema,
  loginSchema,
  registerSchema,
  postSchema,
  publicPostsSchema,
  dashboardPostsSchema,
  deletePostSchema,
} from "./validation";

describe("profileSchema", () => {
  it("validates valid profile data", () => {
    const validData = {
      full_name: "John Doe",
      headline: "Software Engineer",
      bio: "I love coding.",
    };
    const result = profileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("validates required full_name", () => {
    const invalidData = {
      full_name: "A", // Too short
      headline: "Software Engineer",
      bio: "I love coding.",
    };
    const result = profileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Full Name must be at least 2 characters.",
      );
    }
  });

  it("validates max length of full_name", () => {
    const invalidData = {
      full_name: "A".repeat(51), // Too long
    };
    const result = profileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("allows optional headline and bio", () => {
    const validData = {
      full_name: "John Doe",
    };
    const result = profileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("validates max length of bio", () => {
    const invalidData = {
      full_name: "John Doe",
      bio: "A".repeat(161), // Too long
    };
    const result = profileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Bio must not exceed 160 characters.",
      );
    }
  });
});

describe("loginSchema", () => {
  it("validates valid login data", () => {
    const validData = {
      email: "test@example.com",
      password: "password123",
    };
    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("validates invalid email", () => {
    const invalidData = {
      email: "invalid-email",
      password: "password123",
    };
    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("validates empty password", () => {
    const invalidData = {
      email: "test@example.com",
      password: "",
    };
    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("validates valid registration data", () => {
    const validData = {
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    };
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("validates mismatched passwords", () => {
    const invalidData = {
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password456",
    };
    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Passwords do not match.");
    }
  });

  it("validates short password", () => {
    const invalidData = {
      email: "test@example.com",
      password: "short",
      confirmPassword: "short",
    };
    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("postSchema", () => {
  it("validates valid post data", () => {
    const validData = {
      title: "My New Post",
      slug: "my-new-post",
      content: "<p>Hello World</p>",
      status: "draft",
      categories: ["cat-1"],
    };
    const result = postSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("validates required title", () => {
    const invalidData = {
      title: "Hi", // Too short
      slug: "my-new-post",
      content: "Content",
      status: "draft",
      categories: ["cat-1"],
    };
    const result = postSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Title must be at least 5 characters.",
      );
    }
  });

  it("validates slug format", () => {
    const invalidData = {
      title: "My Post",
      slug: "My Post", // Invalid format
      content: "Content",
      status: "draft",
      categories: ["cat-1"],
    };
    const result = postSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("validates required categories", () => {
    const invalidData = {
      title: "My Post",
      slug: "my-post",
      content: "Content",
      status: "draft",
      categories: [], // Empty
    };
    const result = postSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("allows optional fields", () => {
    const validData = {
      title: "My Post",
      slug: "my-post",
      content: "Content",
      status: "published",
      categories: ["cat-1"],
      tags: ["tag-1"],
      excerpt: "Short summary",
    };
    const result = postSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe("publicPostsSchema", () => {
  it("validates valid query params", () => {
    const validData = {
      page: 1,
      limit: 10,
      search: "hello",
      category: "tech",
    };
    const result = publicPostsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("coerces string numbers", () => {
    const validData = {
      page: "2",
      limit: "20",
    };
    const result = publicPostsSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(20);
    }
  });

  it("uses defaults", () => {
    const validData = {};
    const result = publicPostsSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    }
  });
});

describe("dashboardPostsSchema", () => {
  it("validates valid dashboard params", () => {
    const validData = {
      page: 1,
      limit: 10,
      status: "published",
      sort: "title",
      order: "asc",
    };
    const result = dashboardPostsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("validates invalid status", () => {
    const invalidData = {
      status: "invalid-status",
    };
    const result = dashboardPostsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("deletePostSchema", () => {
  it("validates valid uuid", () => {
    const validData = {
      id: "123e4567-e89b-12d3-a456-426614174000",
    };
    const result = deletePostSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("validates invalid uuid", () => {
    const invalidData = {
      id: "not-a-uuid",
    };
    const result = deletePostSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
