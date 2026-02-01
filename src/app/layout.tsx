import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Assuming Inter was used as visible in previous context, though not explicitly in what I read just now. I'll stick to basic.
// Actually I should have checked layout.tsx. I will check it in a sec, but for now I'll use basic and then can update.
// Wait, I saw it in Step 11: import { Inter } from "next/font/google"; import { ThemeProvider } from "@/components/theme-provider"; import { cookies } from "next/headers"; import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { cookies } from "next/headers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Able Pro Tailwind - Next.js",
  description: "Ported Able Pro Tailwind to Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";

  return (
    <html lang="en" className={`${inter.variable} ${theme}`}>
      <body className="font-sans antialiased">
        <ThemeProvider defaultTheme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
