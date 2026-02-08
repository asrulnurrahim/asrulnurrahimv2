import type { Metadata } from "next";

import ClientLayout from "@/components/shell/ClientLayout";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { cookies } from "next/headers";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Asrul Nur Rahim - Front-End Engineer & UI Architect",
    template: "%s | Asrul Nur Rahim",
  },
  description:
    "Personal website of Asrul Nur Rahim. Specializing in pixel-perfect UI, performance optimization, and scalable front-end architecture.",
  keywords: [
    "Front-End Engineer",
    "UI Architect",
    "React Developer",
    "Next.js Expert",
    "TypeScript",
    "Tailwind CSS",
  ],
  authors: [{ name: "Asrul Nur Rahim", url: "https://asrulnurrahim.com" }],
  creator: "Asrul Nur Rahim",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Asrul Nur Rahim - Front-End Engineer & UI Architect",
    description:
      "Crafting high-performance web experiences with precision and passion.",
    siteName: "Asrul Nur Rahim",
    images: [
      {
        url: "/asrul.jpg", // Ensure this image exists, or update
        width: 1200,
        height: 630,
        alt: "Asrul Nur Rahim",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Asrul Nur Rahim - Front-End Engineer & UI Architect",
    description:
      "Crafting high-performance web experiences with precision and passion.",
    images: ["/asrul.jpg"],
    creator: "@asrulnurrahim", // Update with actual handle if strictly known, otherwise generic
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    <html lang="en" className={`${theme} ${jakarta.variable}`}>
      <body className="font-default text-text-default antialiased">
        <ThemeProvider defaultTheme={theme}>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
