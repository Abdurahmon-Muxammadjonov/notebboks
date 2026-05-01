import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppPreferencesProvider } from "@/components/app-preferences-provider";
import { HashScrollHandler } from "@/components/hash-scroll-handler";
import "./globals.css";

export const metadata: Metadata = {
  title: "TS Notebook Shop",
  description: "Responsive tech storefront with multilingual support, dark mode, cart, checkout, and promotional offers.",
  applicationName: "TS Notebook Shop",
  keywords: ["Next.js store", "tech shop", "notebooks", "checkout", "dark mode", "responsive ecommerce"],
  category: "technology",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased transition-colors duration-300">
        <a href="#page-content" className="sr-only left-4 top-4 z-[100] rounded-full bg-[#0156ff] px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed">
          Skip to content
        </a>
        <AppPreferencesProvider>
          <HashScrollHandler />
          <div id="page-content">{children}</div>
        </AppPreferencesProvider>
      </body>
    </html>
  );
}
