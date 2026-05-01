"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { useAppPreferences } from "@/components/app-preferences-provider";

export function TopBar() {
  const { t } = useAppPreferences();

  return (
    <div className="app-topbar w-full px-4 text-[12px]">
      <div className="mx-auto flex max-w-360 flex-wrap items-center justify-center gap-x-5 gap-y-2 py-2.5 md:justify-between">
        {/* Left: Hours */}
        <div className="flex items-center gap-1 font-medium">
          <span className="text-white/70">{t("topBar.days")}</span>
          <span className="font-bold">{t("topBar.hours")}</span>
          <ChevronDown className="h-3.5 w-3.5 text-white/70" />
        </div>

        {/* Center: Showroom */}
        <div className="hidden items-center gap-1.5 text-center text-white/80 md:flex">
          <span>{t("topBar.showroom")}</span>
          <Link
            href="/#support"
            className="border-b border-white font-semibold text-white hover:text-white/80"
          >
            {t("topBar.contactUs")}
          </Link>
        </div>

        {/* Right: Phone + Social */}
        <div className="flex items-center gap-3 font-medium">
          <span>{t("topBar.callUs")} (00) 1234 5678</span>
          <div className="flex items-center gap-2">
            {/* Facebook */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-white" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            {/* Instagram */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-white fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
