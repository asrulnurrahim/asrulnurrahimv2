import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/providers/theme-provider";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`border-input focus-visible:ring-ring relative inline-flex h-8 w-14 items-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
        isDark ? "bg-slate-950" : "bg-white"
      }`}
      aria-label="Toggle theme"
    >
      <motion.div
        className="bg-primary text-primary-foreground absolute right-1 left-1 flex h-5 w-5 items-center justify-center rounded-full shadow-sm"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div
          initial={false}
          animate={{ scale: isDark ? 0 : 1, opacity: isDark ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <Sun className="h-4 w-4" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{ scale: isDark ? 1 : 0, opacity: isDark ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <Moon className="h-4 w-4" />
        </motion.div>
      </motion.div>

      {/* Background icons for visual context */}
      <div className="text-muted-foreground/30 absolute left-2 z-0">
        <Sun className="h-4 w-4" />
      </div>
      <div className="text-muted-foreground/30 absolute right-2 z-0">
        <Moon className="h-4 w-4" />
      </div>
    </button>
  );
}
