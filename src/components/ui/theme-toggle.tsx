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
      className={`relative inline-flex h-8 w-14 items-center rounded-full border border-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        isDark ? "bg-slate-950" : "bg-white"
      }`}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute right-1 left-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm"
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
      <div className="absolute left-2 text-muted-foreground/30 z-0">
        <Sun className="h-4 w-4" />
      </div>
      <div className="absolute right-2 text-muted-foreground/30 z-0">
        <Moon className="h-4 w-4" />
      </div>
    </button>
  );
}
