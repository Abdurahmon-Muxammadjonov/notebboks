"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import type { ProductItem } from "@/lib/products";
import { useAppPreferences } from "@/components/app-preferences-provider";

const VISIBLE = 6;
const INTERVAL_MS = 3000;

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

function ProductCard({ product, index }: { product: ProductItem; index: number }) {
  const { t } = useAppPreferences();
  const inStock = product.stockStatus === "in_stock";
  const oldPrice =
    typeof product.oldPrice === "number" && product.oldPrice > product.price
      ? product.oldPrice
      : product.price + 0.01;

  const variants = [
    "from-slate-900 via-blue-950 to-slate-700",
    "from-zinc-100 via-white to-zinc-200",
    "from-black via-zinc-900 to-slate-800",
    "from-zinc-900 via-neutral-800 to-zinc-700",
  ];

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <article className="group min-w-0 cursor-pointer border-r border-[#e7eef6] px-5 pb-5 pt-2 transition-colors duration-200 last:border-r-0 hover:bg-[#fcfdff]">
      {/* Stock badge */}
      <div className={`mb-5 flex items-center gap-1.5 text-[13px] font-medium ${inStock ? "text-[#78a962]" : "text-[#c94d3f]"}`}>
        {inStock ? (
          <CheckCircle2 className="h-3.5 w-3.5 fill-current text-current" />
        ) : (
          <AlertCircle className="h-3.5 w-3.5" />
        )}
        <span>{inStock ? t("product.inStock") : t("product.checkAvailability")}</span>
      </div>

      {/* Image */}
      <div className="mb-5 flex h-40 items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-40 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className={`relative h-40 w-37.5 rounded-xl bg-linear-to-b ${variants[index % variants.length]}`}
          >
            <div className="absolute inset-x-4 top-4 h-20 rounded-lg border border-white/10 bg-white/10" />
            <div className="absolute bottom-4 left-1/2 h-8 w-24 -translate-x-1/2 rounded-full bg-black/25 blur-md" />
            <div className="absolute bottom-5 left-1/2 h-10 w-16 -translate-x-1/2 rounded-md border border-white/10 bg-white/10" />
          </div>
        )}
      </div>

      {/* Stars */}
      <div className="mb-3 flex items-center gap-0.5 text-[#f7b500]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < product.rating ? "fill-current" : "fill-[#d9dde5] text-[#d9dde5]"}`}
          />
        ))}
        <span className="ml-2 text-[13px] text-[#a2a6b0]">{t("product.reviews", { count: product.reviewsCount })}</span>
      </div>

      {/* Name */}
      <h3 className="line-clamp-3 min-h-18 text-[15px] leading-[1.45] tracking-[-0.01em] text-[#1a1a1a] transition-colors duration-200 group-hover:text-[#0156ff]">
        {product.name}
      </h3>

      {/* Price */}
      <div className="mt-4">
        <p className="text-[15px] text-[#999] line-through">{formatPrice(oldPrice)}</p>
        <p className="mt-0.5 text-[26px] font-semibold tracking-[-0.04em] text-black">
          {formatPrice(product.price)}
        </p>
      </div>
      </article>
    </Link>
  );
}

export function NewProductsSlider({ products }: { products: ProductItem[] }) {
  const { t } = useAppPreferences();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = products.length;

  const visibleCount = Math.min(VISIBLE, total);
  const maxIndex = Math.max(0, total - visibleCount);

  function animateTo(nextIndex: number, nextDirection: "next" | "prev") {
    if (maxIndex === 0 || isAnimating) {
      return;
    }

    setDirection(nextDirection);
    setIsAnimating(true);

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = setTimeout(() => {
      setCurrent(nextIndex);
      setIsAnimating(false);
    }, 260);
  }

  function next() {
    const nextIndex = current >= maxIndex ? 0 : current + 1;
    animateTo(nextIndex, "next");
  }

  function prev() {
    const nextIndex = current <= 0 ? maxIndex : current - 1;
    animateTo(nextIndex, "prev");
  }

  function resetTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (maxIndex > 0) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => {
          setDirection("next");
          setIsAnimating(true);

          if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
          }

          animationTimeoutRef.current = setTimeout(() => {
            setIsAnimating(false);
          }, 260);

          return prev >= maxIndex ? 0 : prev + 1;
        });
      }, INTERVAL_MS);
    }
  }

  useEffect(() => {
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [maxIndex, total]);

  function handlePrev() {
    prev();
    resetTimer();
  }

  function handleNext() {
    next();
    resetTimer();
  }

  const visible = products.slice(current, current + visibleCount);

  return (
    <section id="new-products" className="mb-10 scroll-mt-28 sm:mb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="app-heading text-[28px] font-semibold tracking-[-0.03em] sm:text-[34px]">{t("newProducts.title")}</h2>
        <Link
          href="/products"
          className="text-[14px] font-medium text-[#0156ff] underline underline-offset-4 sm:text-[16px]"
        >
          {t("newProducts.seeAll")}
        </Link>
      </div>

      {/* Slider */}
      <div className="relative mt-5 overflow-hidden border-b border-[#e7eef6] bg-white sm:mt-7">
        {/* Prev btn */}
        <button
          onClick={handlePrev}
          aria-label="Previous"
          className="absolute left-0 top-1/2 z-10 hidden h-18.5 w-9.5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-full bg-[#f2f4f7] text-[#c1c8d3] shadow-sm transition-all duration-200 hover:bg-[#e5eaf0] hover:text-[#6f7785] hover:shadow-md active:scale-95 md:flex"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Cards */}
        <div
          className={`grid pb-6 transition-all duration-300 ease-out ${
            isAnimating
              ? direction === "next"
                ? "-translate-x-3 opacity-0"
                : "translate-x-3 opacity-0"
              : "translate-x-0 opacity-100"
          }`}
          style={{ gridTemplateColumns: `repeat(${visibleCount}, minmax(220px, 1fr))` }}
        >
          {visible.map((product, i) => (
            <ProductCard key={`${product.id}-${current}`} product={product} index={current + i} />
          ))}
        </div>

        {/* Next btn */}
        <button
          onClick={handleNext}
          aria-label="Next"
          className="absolute right-0 top-1/2 z-10 hidden h-18.5 w-9.5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-l-full bg-[#f2f4f7] text-[#c1c8d3] shadow-sm transition-all duration-200 hover:bg-[#e5eaf0] hover:text-[#6f7785] hover:shadow-md active:scale-95 md:flex"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}
