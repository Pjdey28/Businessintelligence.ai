import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "BusinessIntelligence.ai",
  description:
    "AI-powered business investigation and decision intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}