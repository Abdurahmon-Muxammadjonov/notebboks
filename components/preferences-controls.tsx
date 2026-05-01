"use client";

import { Globe, Moon, SunMedium } from "lucide-react";

import { useAppPreferences } from "@/components/app-preferences-provider";

export function PreferencesControls() {
  const { language, setLanguage, theme, toggleTheme, t } = useAppPreferences();

  return (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface-soft) px-3 py-1.5 text-[12px] text-(--color-text-muted) md:flex">
        <Globe className="h-3.5 w-3.5 text-(--color-accent)" />
        <select
          aria-label={t("common.language")}
          value={language}
          onChange={(event) => setLanguage(event.target.value as typeof language)}
          className="cursor-pointer bg-transparent font-medium text-(--color-text) outline-none"
        >
          <option value="en">{t("common.english")}</option>
          <option value="uz">{t("common.uzbek")}</option>
          <option value="ru">{t("common.russian")}</option>
        </select>
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface-soft) text-(--color-text) transition-all duration-300 hover:-translate-y-0.5 hover:border-(--color-accent) hover:text-(--color-accent) active:scale-95"
        aria-label={`${t("common.theme")}: ${theme === "light" ? t("common.light") : t("common.dark")}`}
      >
        {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <SunMedium className="h-4.5 w-4.5" />}
      </button>
    </div>
  );
}