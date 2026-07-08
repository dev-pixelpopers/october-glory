import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Preloader from "./components/preloader";
import QueryProvider from "@/lib/api/query-provider";
import { ToastHost } from "./components/salon/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Base for every URL-derived metadata field (canonical tags, OG images).
 * Set NEXT_PUBLIC_SITE_URL to the production origin when deploying.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "October Glory",
  description:
    "October Glory — more than a salon, a luxury hair experience. Natural styles, silk presses, weaves, treatments and color by expert stylists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <Preloader />
          {children}
          <ToastHost />
        </QueryProvider>
      </body>
    </html>
  );
}
