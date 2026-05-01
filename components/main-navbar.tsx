"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, X } from "lucide-react";

import { useAppPreferences } from "@/components/app-preferences-provider";
import { CartBadge } from "@/components/cart-badge";
import { PreferencesControls } from "@/components/preferences-controls";
import { scrollToSection } from "@/lib/section-scroll";

const links = [
  { labelKey: "nav.laptops", sectionId: "notebooks" },
  { labelKey: "nav.desktopPcs", sectionId: "pc-corpuses" },
  { labelKey: "nav.networkingDevices", sectionId: "new-products" },
  { labelKey: "nav.printersScanners", sectionId: "monitors" },
  { labelKey: "nav.pcParts", sectionId: "brands" },
  { labelKey: "nav.allOtherProducts", sectionId: "blog" },
  { labelKey: "nav.repairs", sectionId: "support" },
];

const PENDING_HASH_KEY = "ts-notebook-shop-pending-hash";

export function MainNavbar() {
  const { t } = useAppPreferences();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(pathname === "/deals" ? "deals" : null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", isMenuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSectionId(pathname === "/deals" ? "deals" : null);
      return;
    }

    const sectionIds = links.map((link) => link.sectionId);
    const sections = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      setActiveSectionId(sectionIds[0] ?? null);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          setActiveSectionId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.2, 0.35, 0.55],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  const navItems = useMemo(() => links.map((item) => ({ ...item, href: `/#${item.sectionId}` })), []);

  const handleNavigateToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    setActiveSectionId(sectionId);

    if (pathname === "/") {
      scrollToSection(sectionId);
      return;
    }

    window.sessionStorage.setItem(PENDING_HASH_KEY, sectionId);
    router.push(`/#${sectionId}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 app-surface app-border border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-360 items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo + Nav */}
        <div className="flex items-center gap-4 lg:gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center">
            <div className="relative h-9 w-9 sm:h-10 sm:w-10">
              {/* Top bar - solid */}
              <div className="absolute left-0.5 top-0 h-3.5 w-7 -skew-x-12 rounded-[3px] bg-[#0156ff]" />
              {/* Middle bar - outline */}
              <div className="absolute left-0.5 top-2.75 h-3.5 w-7 -skew-x-12 rounded-[3px] border-[2.5px] border-[#0156ff] bg-white" />
              {/* Bottom bar - solid small */}
              <div className="absolute left-3.5 top-5.5 h-2.75 w-4 -skew-x-12 rounded-[3px] bg-[#0156ff]" />
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-5 xl:gap-7 lg:flex">
            {navItems.map(({ labelKey, sectionId, href }) => (
              <Link
                key={labelKey}
                href={href}
                onClick={(event) => {
                  event.preventDefault();
                  handleNavigateToSection(sectionId);
                }}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-[14.5px] font-semibold transition-all duration-300 ${activeSectionId === sectionId ? "bg-(--color-surface-soft) text-(--color-accent) shadow-sm" : "app-text hover:text-[#0156ff]"}`}
                aria-current={activeSectionId === sectionId ? "page" : undefined}
              >
                {t(labelKey)}
              </Link>
            ))}
            <Link
              href="/deals"
              className={`whitespace-nowrap rounded-full border-2 px-5 py-2 text-[14.5px] font-semibold transition-colors ${pathname === "/deals" ? "border-[#0156ff] bg-[#0156ff] text-white" : "border-[#0156ff] text-[#0156ff] hover:bg-[#0156ff] hover:text-white"}`}
              aria-current={pathname === "/deals" ? "page" : undefined}
            >
              {t("nav.ourDeals")}
            </Link>
          </nav>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
          <div className="hidden sm:block">
            <PreferencesControls />
          </div>
          <Search className="app-text hidden h-5 w-5 cursor-pointer md:block" strokeWidth={2} />

          <CartBadge />

          {/* Avatar */}
          <div className="app-surface-soft hidden h-9 w-9 items-center justify-center overflow-hidden rounded-full md:flex">
            <User className="app-muted h-5 w-5" />
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface-soft) lg:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <span className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${isMenuOpen ? "rotate-45" : "-translate-y-1.5"}`} />
            <span className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${isMenuOpen ? "-rotate-45" : "translate-y-1.5"}`} />
          </button>
        </div>
      </div>
    </header>

    {isMenuOpen ? (
      <div className="fixed inset-0 z-50 lg:hidden">
        <button type="button" onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" aria-label="Close mobile menu overlay" />
        <aside className="absolute right-0 top-0 flex h-full w-full max-w-xs flex-col border-l border-(--color-border) bg-(--color-surface) p-5 shadow-2xl animate-drawer-in sm:max-w-sm">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/" className="text-[18px] font-bold text-(--color-text)">TS Shop</Link>
            <button type="button" onClick={() => setIsMenuOpen(false)} className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-(--color-surface-soft)" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-5 rounded-2xl border border-(--color-border) bg-(--color-surface-soft) p-3 sm:hidden">
            <PreferencesControls />
          </div>

          <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
            {navItems.map(({ labelKey, sectionId, href }) => (
              <Link
                key={labelKey}
                href={href}
                onClick={(event) => {
                  event.preventDefault();
                  handleNavigateToSection(sectionId);
                }}
                className={`rounded-2xl px-4 py-3 text-[15px] font-semibold transition-all duration-300 ${activeSectionId === sectionId ? "bg-(--color-surface-soft) text-(--color-accent)" : "text-(--color-text) hover:bg-(--color-surface-soft) hover:text-(--color-accent)"}`}
                aria-current={activeSectionId === sectionId ? "page" : undefined}
              >
                {t(labelKey)}
              </Link>
            ))}
            <Link href="/deals" className={`mt-3 inline-flex items-center justify-center rounded-full px-5 py-3 text-[14px] font-semibold transition-all duration-300 ${pathname === "/deals" ? "bg-[#0d63ff] text-white" : "bg-[#0156ff] text-white hover:bg-[#0d63ff]"}`} aria-current={pathname === "/deals" ? "page" : undefined}>
              {t("nav.ourDeals")}
            </Link>
          </nav>
        </aside>
      </div>
    ) : null}
    </>
  );
}
