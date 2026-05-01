"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import type { ProductItem } from "@/lib/products";
import { useAppPreferences } from "@/components/app-preferences-provider";

/* ─── helpers ─────────────────────────────────────────────── */
function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Math.round(price) + 0.99);
}

function formatOldPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Math.round(price) + 0.99 + 100);
}

/* ─── category meta ────────────────────────────────────────── */
type CategoryMeta = {
  label: string;
  gradient: string;
  tabs: string[];
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  "PC Corpuses": {
    label: "Custom\nBuilds",
    gradient: "from-[#0d0f14] via-[#131620] to-[#1a1d2e]",
    tabs: ["category.customBuilds", "category.preBuiltPcs", "category.miniItx", "category.towerCases"],
  },
  Notebooks: {
    label: "MSI\nLaptops",
    gradient: "from-[#0a1628] via-[#0d1f3c] to-[#111]",
    tabs: ["category.msiGs", "category.msiGt", "category.msiGl", "category.msiGe"],
  },
  Monitors: {
    label: "Gaming\nMonitors",
    gradient: "from-[#100814] via-[#1a0a1e] to-[#0d0d0d]",
    tabs: ["category.gaming", "category.professional", "category.curved", "category.ultraWide"],
  },
  default: {
    label: "Desktops",
    gradient: "from-[#0f0f0f] via-[#161616] to-[#1c1c1c]",
    tabs: ["category.msiInfinite", "category.msiTrident", "category.msiGl", "category.msiNightblade"],
  },
};

function getMeta(category: string): CategoryMeta {
  return CATEGORY_META[category] ?? CATEGORY_META.default;
}

/* ─── ProductCard ───────────────────────────────────────────── */
function ProductCard({ product, index, categoryHref }: { product: ProductItem; index: number; categoryHref: string }) {
  const { t } = useAppPreferences();
  const inStock = product.stockStatus === "in_stock";
  const variants = [
    "from-slate-900 via-blue-950 to-slate-700",
    "from-zinc-100 via-white to-zinc-200",
    "from-black via-zinc-900 to-slate-800",
    "from-zinc-900 via-neutral-800 to-zinc-700",
  ];

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <article className="group relative flex min-w-0 cursor-pointer flex-col border-r border-[#e7eef6] bg-white px-4 pb-5 pt-3 transition-shadow duration-200 last:border-r-0 hover:z-10 hover:shadow-[0_4px_24px_rgba(0,0,0,0.10)]">
      {/* Stock */}
      <div className={`mb-3 flex items-center gap-1.5 text-[12px] font-medium ${inStock ? "text-[#78a962]" : "text-[#c94d3f]"}`}>
        {inStock ? (
          <CheckCircle2 className="h-3.5 w-3.5 fill-current" />
        ) : (
          <AlertCircle className="h-3.5 w-3.5" />
        )}
        <span>{inStock ? t("product.inStock") : t("product.checkAvailability")}</span>
      </div>

      {/* Image */}
      <div className="mb-4 flex h-36 items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-36 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className={`relative h-36 w-36 rounded-xl bg-linear-to-b ${variants[index % variants.length]} transition-transform duration-300 group-hover:scale-105`}>
            <div className="absolute inset-x-4 top-4 h-16 rounded-lg border border-white/10 bg-white/10" />
            <div className="absolute bottom-4 left-1/2 h-6 w-20 -translate-x-1/2 rounded-full bg-black/25 blur-md" />
            <div className="absolute bottom-5 left-1/2 h-8 w-14 -translate-x-1/2 rounded-md border border-white/10 bg-white/10" />
          </div>
        )}
      </div>

      {/* Stars */}
      <div className="mb-2.5 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < product.rating ? "fill-[#f7b500] text-[#f7b500]" : "fill-[#d9dde5] text-[#d9dde5]"}`}
          />
        ))}
        <span className="ml-1.5 text-[12px] text-[#a2a6b0]">{t("product.reviews", { count: product.reviewsCount })}</span>
      </div>

      {/* Name */}
      <h3 className="line-clamp-3 min-h-15.75 text-[13px] leading-normal text-[#1a1a1a] transition-colors duration-150 group-hover:text-[#0156ff]">
        {product.name}
      </h3>

      {/* Price */}
      <div className="mt-3">
        <p className="text-[13px] text-[#999] line-through">{formatOldPrice(product.price)}</p>
        <p className="text-[22px] font-bold tracking-[-0.04em] text-black">{formatPrice(product.price)}</p>
      </div>
      </article>
    </Link>
  );
}

/* ─── CategoryBanner ────────────────────────────────────────── */
function CategoryBanner({
  category,
  categoryHref,
}: {
  category: string;
  categoryHref: string;
}) {
  const { t } = useAppPreferences();
  const meta = getMeta(category);
  const lines = meta.label.split("\n");

  return (
    <div className={`relative flex min-h-full flex-col justify-between overflow-hidden bg-linear-to-b ${meta.gradient} p-6 text-white`}>
      {/* decorative circle */}
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-52 w-52 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -left-6 top-10 h-32 w-32 rounded-full bg-white/3" />

      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">{t("category.collection")}</p>
        <h3 className="text-[30px] font-bold leading-[1.1] tracking-[-0.03em]">
          {lines.map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h3>
      </div>

      <Link
        href={categoryHref}
        className="mt-8 inline-flex w-fit text-[12px] font-semibold text-white underline underline-offset-4 transition-opacity hover:opacity-70"
      >
        {t("category.seeAllProducts")}
      </Link>
    </div>
  );
}

/* ─── CategorySectionClient ─────────────────────────────────── */
type Props = {
  sectionId: string;
  category: string;
  products: ProductItem[];
  categoryHref: string;
};

export function CategorySectionClient({ sectionId, category, products, categoryHref }: Props) {
  const { t } = useAppPreferences();
  const meta = getMeta(category);
  const [activeTab, setActiveTab] = useState(0);
  const [current, setCurrent] = useState(0);
  const [animDir, setAnimDir] = useState<"left" | "right">("right");
  const [animating, setAnimating] = useState(false);

  const VISIBLE = 5;
  const maxIndex = Math.max(0, products.length - VISIBLE);

  function go(next: number, dir: "left" | "right") {
    if (animating) return;
    setAnimDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(next);
      setAnimating(false);
    }, 320);
  }

  function handlePrev() {
    const next = current <= 0 ? maxIndex : current - 1;
    go(next, "left");
  }

  function handleNext() {
    const next = current >= maxIndex ? 0 : current + 1;
    go(next, "right");
  }

  const visibleProducts = products.slice(current, current + VISIBLE);

  return (
    <section id={sectionId} className="scroll-mt-28 overflow-hidden border border-[#e7eef6] bg-white">
      <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr]">
        {/* Banner */}
        <CategoryBanner category={category} categoryHref={categoryHref} />

        {/* Right side */}
        <div className="relative overflow-hidden bg-white">
          {/* Tabs */}
          <div className="flex items-center gap-0 overflow-x-auto border-b border-[#eef2f7] px-2 sm:px-4">
            {meta.tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(i); setCurrent(0); }}
                className={`relative shrink-0 cursor-pointer px-3 py-3 text-[12px] font-medium transition-all duration-200 sm:px-4 sm:py-3.5 sm:text-[13px] ${
                  i === activeTab
                    ? "text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0156ff] after:content-['']"
                    : "text-[#7b8394] hover:text-black"
                }`}
              >
                {t(tab)}
              </button>
            ))}
          </div>

          {/* Prev btn */}
          {products.length > VISIBLE && (
            <button
              onClick={handlePrev}
              aria-label="Previous"
              className="absolute left-0 top-1/2 z-10 hidden h-18.5 w-9.5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-full bg-[#f2f4f7] text-[#c1c8d3] shadow-sm transition-all duration-200 hover:bg-[#e5eaf0] hover:text-[#555] hover:shadow-md active:scale-95 md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Cards */}
          <div
            className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 transition-all duration-300 ${
              animating
                ? animDir === "right"
                  ? "translate-x-[-2%] opacity-0"
                  : "translate-x-[2%] opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            {visibleProducts.map((product, i) => (
              <ProductCard key={`${product.id}-${current}`} product={product} index={current + i} categoryHref={categoryHref} />
            ))}
          </div>

          {/* Next btn */}
          {products.length > VISIBLE && (
            <button
              onClick={handleNext}
              aria-label="Next"
              className="absolute right-0 top-1/2 z-10 hidden h-18.5 w-9.5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-l-full bg-[#f2f4f7] text-[#c1c8d3] shadow-sm transition-all duration-200 hover:bg-[#e5eaf0] hover:text-[#555] hover:shadow-md active:scale-95 md:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
