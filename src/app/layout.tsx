import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "foldframe — preview sites on foldables, flips & dual screens",
  description:
    "An open-source device preview lab for foldables, flips, dual-screen phones and more. Paste a URL or localhost address and see it on realistic device frames.",
  keywords: [
    "foldable",
    "device preview",
    "responsive design",
    "localhost",
    "samsung fold",
    "galaxy flip",
    "surface duo",
    "nextjs",
    "open source",
  ],
  openGraph: {
    title: "foldframe — preview sites on foldables, flips & dual screens",
    description:
      "Paste a link or localhost URL and preview it on foldables, flips, dual-screen phones and more.",
    type: "website",
    images: [
      {
        url: "/screenshot.png",
        width: 1440,
        height: 900,
        alt: "foldframe previewing a website on a Galaxy Z Fold 6 and Galaxy Z Flip 6",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "foldframe",
    description:
      "An open-source preview lab for foldables, flips and dual-screen devices.",
    images: ["/screenshot.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#060709",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
