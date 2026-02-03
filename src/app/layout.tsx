import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Assuming Inter was used as visible in previous context, though not explicitly in what I read just now. I'll stick to basic.
// Actually I should have checked layout.tsx. I will check it in a sec, but for now I'll use basic and then can update.
// Wait, I saw it in Step 11: import { Inter } from "next/font/google"; import { ThemeProvider } from "@/components/theme-provider"; import { cookies } from "next/headers"; import "./globals.css";

import ClientLayout from "@/components/layout/ClientLayout";
import { ThemeProvider } from "@/components/theme-provider";
import { cookies } from "next/headers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Asrul Nur Rahim - Front-End Engineer",
  description:
    "Personal website of Asrul Nur Rahim, a Front-End Engineer and UI Architect.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
    ],
  },
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
        <ThemeProvider defaultTheme={theme}>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
