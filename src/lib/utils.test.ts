import { describe, it, expect } from "vitest";
import { cn, slugify, formatDate, calculateReadingTime } from "./utils";

describe("Utility Functions", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
    });

    it("should handle conditional classes", () => {
      expect(cn("bg-red-500", false && "text-white", "p-4")).toBe(
        "bg-red-500 p-4",
      );
    });

    it("should handle tailwind conflicts", () => {
      expect(cn("p-4", "p-8")).toBe("p-8");
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });
  });

  describe("slugify", () => {
    it("should convert text to slug", () => {
      expect(slugify("Hello World")).toBe("hello-world");
      expect(slugify("Next.js 14 Course")).toBe("nextjs-14-course");
    });

    it("should handle special characters", () => {
      expect(slugify("Café & Bar")).toBe("cafe-bar");
    });
  });

  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2023-01-01T00:00:00.000Z");
      expect(formatDate(date)).toBe("January 1, 2023");
    });
  });

  describe("calculateReadingTime", () => {
    it("should calculate reading time correctly", () => {
      const text = "word ".repeat(200); // 200 words should be 1 min
      expect(calculateReadingTime(text)).toEqual({
        readingTime: 1,
        wordCount: 200,
      });
    });

    it("should return at least 1 min for short text", () => {
      const text = "Short text";
      expect(calculateReadingTime(text)).toEqual({
        readingTime: 1,
        wordCount: 2,
      });
    });
  });
});
