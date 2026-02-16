"use client";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { type ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
  defaultTheme?: string;
}

export function Providers({ children, defaultTheme }: ProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme={defaultTheme}>{children}</ThemeProvider>
    </QueryProvider>
  );
}
