import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";

import type { ProductItem } from "@/lib/products";
import { PRODUCT_CATEGORY_TAGS } from "@/lib/products";

type ProductSectionProps = {
  products: ProductItem[];
};

type ProductCategoryGroup = {
  category: string;
  products: ProductItem[];
};

const NEW_PRODUCTS_LIMIT = 6;
const DECIMAL_PRICE_COUNT = 4;

function formatPrice(price: number, showDecimals: boolean) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(price);
}

function getDisplayPrice(price: number, showDecimals: boolean) {
  const roundedPrice = Math.round(price);

  return showDecimals ? roundedPrice + 0.99 : roundedPrice;
}

function ProductIllustration({ index }: { index: number }) {
  const variants = [
    "from-slate-900 via-blue-950 to-slate-700",
    "from-zinc-100 via-white to-zinc-200",
    "from-black via-zinc-900 to-slate-800",
    "from-zinc-900 via-neutral-800 to-zinc-700",
  ];

  return (
    <div className={`relative mx-auto h-40 w-37.5 rounded-xl bg-linear-to-b ${variants[index % variants.length]}`}>
      <div className="absolute inset-x-4 top-4 h-20 rounded-lg border border-white/10 bg-white/10" />
      <div className="absolute bottom-4 left-1/2 h-8 w-24 -translate-x-1/2 rounded-full bg-black/25 blur-md" />
      <div className="absolute bottom-5 left-1/2 h-10 w-16 -translate-x-1/2 rounded-md border border-white/10 bg-white/10" />
    </div>
  );
}

function ProductCard({ product, index, displayIndex }: { product: ProductItem; index: number; displayIndex: number }) {
  const inStock = product.stockStatus === "in_stock";
  const showDecimals = displayIndex < DECIMAL_PRICE_COUNT;
  const displayPrice = getDisplayPrice(product.price, showDecimals);
  const displayOldPrice =
    typeof product.oldPrice === "number" && product.oldPrice > product.price
      ? getDisplayPrice(product.oldPrice, showDecimals)
      : null;

  return (
    <article className="group min-w-0 border-r border-[#e7eef6] px-5 pb-5 pt-2 last:border-r-0">
      <div className={`mb-5 flex items-center gap-2 text-[14px] ${inStock ? "text-[#78a962]" : "text-[#c94d3f]"}`}>
        {inStock ? <CheckCircle2 className="h-4 w-4 fill-current text-current" /> : <AlertCircle className="h-4 w-4" />}
        <span>{inStock ? "in stock" : "check availability"}</span>
      </div>

      <div className="mb-5 flex h-42.5 items-center justify-center">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="max-h-40 w-auto object-contain" />
        ) : (
          <ProductIllustration index={index} />
        )}
      </div>

      <div className="mb-4 flex items-center gap-1 text-[#f7b500]">
        {Array.from({ length: 5 }).map((_, starIndex) => (
          <Star
            key={`${product.id}-${starIndex}`}
            className={`h-4 w-4 ${starIndex < product.rating ? "fill-current" : "fill-[#d9dde5] text-[#d9dde5]"}`}
          />
        ))}
        <span className="ml-2 text-[14px] text-[#a2a6b0]">Reviews ({product.reviewsCount})</span>
      </div>

      <h3 className="min-h-27.5 text-[18px] leading-[1.45] tracking-[-0.02em] text-[#1a1a1a]">
        {product.name}
      </h3>

      <div className="mt-5">
        {typeof displayOldPrice === "number" ? (
          <p className="text-[20px] text-[#666] line-through decoration-[#666]">{formatPrice(displayOldPrice, showDecimals)}</p>
        ) : null}
        <p className="mt-1 text-[32px] font-semibold tracking-[-0.04em] text-black">{formatPrice(displayPrice, showDecimals)}</p>
      </div>
    </article>
  );
}

function NewProductsSection({ products }: { products: ProductItem[] }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-[34px] font-semibold tracking-[-0.03em] text-black">New Products</h2>
        <Link href="/products" className="text-[18px] font-medium text-[#0156ff] underline underline-offset-4">
          See All New Products
        </Link>
      </div>

      <div className="relative mt-7 overflow-hidden rounded-sm border-b border-[#e7eef6] bg-white pb-6">
        <button className="absolute left-0 top-1/2 z-10 flex h-18.5 w-9.5 -translate-y-1/2 items-center justify-center rounded-r-full bg-[#f2f4f7] text-[#c1c8d3] shadow-sm">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button className="absolute right-0 top-1/2 z-10 flex h-18.5 w-9.5 -translate-y-1/2 items-center justify-center rounded-l-full bg-[#f2f4f7] text-[#c1c8d3] shadow-sm">
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} displayIndex={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function getCategoryTitle(product: ProductItem) {
  const category = product.category?.trim() ?? "";

  const titleByTag: Record<string, string> = {
    PCcorpuse: "PC Corpuses",
    Monitor: "Monitors",
    Notebook: "Notebooks",
  };

  if (PRODUCT_CATEGORY_TAGS.includes(category as (typeof PRODUCT_CATEGORY_TAGS)[number])) {
    return titleByTag[category];
  }

  return category || "Other Products";
}

function getCategoryGroups(products: ProductItem[]): ProductCategoryGroup[] {
  const grouped = new Map<string, ProductItem[]>();

  for (const product of products) {
    const category = getCategoryTitle(product);
    const list = grouped.get(category) ?? [];

    list.push(product);
    grouped.set(category, list);
  }

  return Array.from(grouped.entries())
    .sort(([leftCategory], [rightCategory]) => leftCategory.localeCompare(rightCategory))
    .map(([category, items]) => ({
      category,
      products: items.sort((leftItem, rightItem) => leftItem.name.localeCompare(rightItem.name)).slice(0, 5),
    }));
}

function CategoryBanner({ category }: { category: string }) {
  const categoryTagByTitle: Record<string, string> = {
    "PC Corpuses": "PCcorpuse",
    Monitors: "Monitor",
    Notebooks: "Notebook",
  };

  const categoryTag = categoryTagByTitle[category];
  const categoryHref = categoryTag ? `/products?category=${encodeURIComponent(categoryTag)}` : "/products";

  return (
    <div className="flex min-h-full flex-col justify-between overflow-hidden bg-linear-to-b from-[#16191f] via-[#101114] to-[#040404] p-7 text-white">
      <div className="space-y-4">
        <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-white/60">MSI Collection</p>
        <h3 className="max-w-45 text-[34px] font-semibold leading-[1.05] tracking-[-0.04em]">{category}</h3>
      </div>

      <Link href={categoryHref} className="mt-10 inline-flex w-fit text-[13px] font-medium text-white underline underline-offset-4">
        See All Products
      </Link>
    </div>
  );
}

function CategorySection({ category, products, startIndex }: ProductCategoryGroup & { startIndex: number }) {
  return (
    <section className="overflow-hidden border-b border-[#e7eef6] bg-white">
      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr]">
        <CategoryBanner category={category} />

        <div className="relative overflow-hidden bg-white">
          <div className="flex items-center gap-5 border-b border-[#eef2f7] px-5 py-4 text-[13px] text-[#7b8394]">
            <span className="font-semibold text-black underline decoration-[#0156ff] underline-offset-6">{category}</span>
            <span>Featured</span>
            <span>Bestsellers</span>
            <span>Latest</span>
          </div>

          <button className="absolute left-0 top-1/2 z-10 flex h-18.5 w-9.5 -translate-y-1/2 items-center justify-center rounded-r-full bg-[#f2f4f7] text-[#c1c8d3] shadow-sm">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="absolute right-0 top-1/2 z-10 flex h-18.5 w-9.5 -translate-y-1/2 items-center justify-center rounded-l-full bg-[#f2f4f7] text-[#c1c8d3] shadow-sm">
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} displayIndex={startIndex + index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Product({ products }: ProductSectionProps) {
  const newProducts = products.slice(0, NEW_PRODUCTS_LIMIT);
  const remainingProducts = products.slice(NEW_PRODUCTS_LIMIT);
  const categoryGroups = getCategoryGroups(remainingProducts);

  return (
    <section className="mx-auto max-w-360 px-4 pb-16 pt-2">
      {newProducts.length > 0 ? <NewProductsSection products={newProducts} /> : null}

      <div className="relative overflow-hidden rounded-sm border-b border-[#e7eef6] bg-white pb-6">
        {categoryGroups.length > 0 ? (
          <div className="space-y-8 pb-2">
            {categoryGroups.map((group, groupIndex) => {
              const startIndex =
                NEW_PRODUCTS_LIMIT +
                categoryGroups.slice(0, groupIndex).reduce((total, currentGroup) => total + currentGroup.products.length, 0);

              return (
                <CategorySection
                  key={group.category}
                  category={group.category}
                  products={group.products}
                  startIndex={startIndex}
                />
              );
            })}
          </div>
        ) : newProducts.length > 0 ? null : (
          <div className="flex min-h-70 items-center justify-center px-6 py-12 text-center">
            <div>
              <p className="text-2xl font-semibold text-black">No products found</p>
              <p className="mt-3 text-[16px] text-[#666]">
                Supabase `products` table is empty or not connected yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
