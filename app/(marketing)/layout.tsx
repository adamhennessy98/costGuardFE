import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "costGuard – Detect Suspicious Invoices Before They Cost You",
  description:
    "Automated invoice analysis for SMEs. Catch overcharges, duplicates, and anomalies before you pay. AI-powered fraud detection for finance teams.",
  keywords: [
    "invoice fraud detection",
    "duplicate invoice",
    "accounts payable automation",
    "invoice analysis",
    "AP automation",
    "finance software",
  ],
  authors: [{ name: "costGuard" }],
  openGraph: {
    title: "costGuard – Detect Suspicious Invoices Before They Cost You",
    description:
      "Automated invoice analysis for SMEs. Catch overcharges, duplicates, and anomalies before you pay.",
    type: "website",
    locale: "en_US",
    siteName: "costGuard",
  },
  twitter: {
    card: "summary_large_image",
    title: "costGuard – Detect Suspicious Invoices Before They Cost You",
    description:
      "Automated invoice analysis for SMEs. Catch overcharges, duplicates, and anomalies before you pay.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${inter.variable} min-h-screen bg-white text-slate-900 antialiased`}
      >
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
