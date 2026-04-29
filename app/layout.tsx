import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TS Notebook Shop",
  description: "Tech store starter built with Next.js and Tailwind",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased">{children}</body>
    </html>
  );
}
