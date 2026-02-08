"use client";

import * as React from "react";
import Cookies from "js-cookie";

type Theme = "dark" | "light";

type ThemeProviderContext = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = React.createContext<
  ThemeProviderContext | undefined
>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: {
  children: React.ReactNode;
  defaultTheme?: string;
}) {
  const [theme, setThemeState] = React.useState<Theme>(() =>
    defaultTheme === "dark" ? "dark" : "light",
  );

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    Cookies.set("theme", newTheme, { expires: 365 });

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);
  }, []);

  // React to external changes if needed or just initialization?
  // Since we set class in layout check, we might not need effect for init.
  // But let's ensure consistency.
  React.useEffect(() => {
    const root = window.document.documentElement;
    // If the class is missing for some reason, add it.
    if (!root.classList.contains("dark") && !root.classList.contains("light")) {
      root.classList.add(theme);
    }
  }, [theme]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme],
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
