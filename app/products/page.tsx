import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid2x2,
  List,
  Star,
  X,
} from "lucide-react";

import { MainNavbar } from "@/components/main-navbar";
import { TopBar } from "@/components/top-bar";
import { HomeBottomSections } from "@/components/home-bottom-sections";
import { PRODUCT_CATEGORY_TAGS, type CatalogSort, type ProductItem, getCatalogProducts } from "@/lib/products";

const SORT_OPTIONS: Array<{ value: CatalogSort; label: string }> = [
  { value: "featured", label: "Position" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A-Z" },
];

const CATEGORY_LABELS: Record<string, string> = {
  PCcorpuse: "Custom PCs",
  Monitor: "HP/COMPAQ PCs",
  Notebook: "MSI PS Series",
};

const CATEGORY_SIDEBAR_LABELS: Record<string, string> = {
  PCcorpuse: "MSI All-In-One PCs",
  Monitor: "HP/COMPAQ PCs",
  Notebook: "CUSTOM PCs",
};

const PRICE_BANDS = [
  "$0.00 - $1,000.00",
  "$1,000.00 - $2,000.00",
  "$2,000.00 - $3,000.00",
  "$3,000.00 - $4,000.00",
  "$4,000.00 - $5,000.00",
  "$5,000.00 - $6,000.00",
  "$6,000.00 - $7,000.00",
  "$7,000.00 And Above",
];

const ITEMS_PER_PAGE = 15;

type ProductsPageProps = {
  searchParams?: Promise<{
    category?: string;
    sort?: string;
    page?: string;
  }>;
};

function isValidSort(value?: string): value is CatalogSort {
  return SORT_OPTIONS.some((option) => option.value === value);
}

function isValidCategory(value?: string): value is (typeof PRODUCT_CATEGORY_TAGS)[number] {
  return PRODUCT_CATEGORY_TAGS.includes(value as (typeof PRODUCT_CATEGORY_TAGS)[number]);
}

function getPageNumber(value?: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

function buildProductsHref({ category, sort, page }: { category?: string; sort?: string; page?: number }) {
  const params = new URLSearchParams();

  if (category && isValidCategory(category)) {
    params.set("category", category);
  }

  if (sort && isValidSort(sort) && sort !== "featured") {
    params.set("sort", sort);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();
  return queryString ? `/products?${queryString}` : "/products";
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

function getDisplayOldPrice(product: ProductItem) {
  if (typeof product.oldPrice === "number" && product.oldPrice > product.price) {
    return product.oldPrice;
  }

  return product.price + 0.01;
}

function getVisiblePagination(currentPage: number, totalPages: number) {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const sortedPages = Array.from(pages).filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];

  for (let index = 0; index < sortedPages.length; index += 1) {
    const page = sortedPages[index];
    const previous = sortedPages[index - 1];

    if (previous && page - previous > 1) {
      items.push("ellipsis");
    }

    items.push(page);
  }

  return items;
}

function ProductListingCard({ product }: { product: ProductItem }) {
  const inStock = product.stockStatus === "in_stock";

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <article className="group flex min-w-0 cursor-pointer flex-col border-b border-r border-[#e7eef6] bg-white px-4 pb-5 pt-3 transition-all duration-200 hover:relative hover:z-10 hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]">
      <div className={`mb-2 flex items-center gap-1.5 text-[10px] font-medium ${inStock ? "text-[#78a962]" : "text-[#c94d3f]"}`}>
        {inStock ? <CheckCircle2 className="h-3 w-3 fill-current" /> : <AlertCircle className="h-3 w-3" />}
        <span>{inStock ? "in stock" : "check availability"}</span>
      </div>

      <div className="mb-3 flex h-28 items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="max-h-28 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="text-xs text-slate-400">No image</div>
        )}
      </div>

      <div className="mb-2 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={`${product.id}-${index}`} className={`h-3 w-3 ${index < product.rating ? "fill-[#f7b500] text-[#f7b500]" : "fill-[#d9dde5] text-[#d9dde5]"}`} />
        ))}
        <span className="ml-1 text-[10px] text-[#a2a6b0]">Reviews ({product.reviewsCount})</span>
      </div>

      <h2 className="line-clamp-3 min-h-16 text-[11px] leading-[1.45] text-[#2a2a2a] transition-colors duration-200 group-hover:text-[#0156ff]">
        EX DISPLAY : {product.name}
      </h2>

      <div className="mt-2">
        <p className="text-[12px] text-[#8c8c8c] line-through">{formatPrice(getDisplayOldPrice(product))}</p>
        <p className="mt-0.5 text-[20px] font-semibold tracking-[-0.03em] text-black">{formatPrice(product.price)}</p>
      </div>
      </article>
    </Link>
  );
}

function FilterSidebar({ selectedSort, categoryCounts }: { selectedSort: CatalogSort; categoryCounts: Record<string, number> }) {
  return (
    <aside className="space-y-4">
      <div className="overflow-hidden rounded-sm border border-[#e5e7eb] bg-white">
        <div className="border-b border-[#eef2f7] px-4 py-3 text-center text-[13px] font-semibold text-black">Filters</div>
        <div className="px-4 py-4">
          <button className="w-full rounded-full border border-[#cfd6e6] px-4 py-2 text-[12px] font-medium text-[#6b7280] transition hover:border-[#0156ff] hover:text-[#0156ff]">
            Clear Filter
          </button>
        </div>

        <div className="space-y-4 border-t border-[#eef2f7] px-4 py-4 text-[12px]">
          <div>
            <div className="mb-3 font-semibold text-black">Category</div>
            <div className="space-y-2 text-[#4b5563]">
              {PRODUCT_CATEGORY_TAGS.map((category) => (
                <Link key={category} href={buildProductsHref({ category, sort: selectedSort, page: 1 })} className="flex items-center justify-between transition hover:text-[#0156ff]">
                  <span>{CATEGORY_SIDEBAR_LABELS[category]}</span>
                  <span>{categoryCounts[category] ?? 0}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-[#eef2f7] pt-4">
            <div className="mb-3 font-semibold text-black">Price</div>
            <div className="space-y-1.5 text-[#4b5563]">
              {PRICE_BANDS.map((band) => (
                <button key={band} className="flex w-full items-center justify-between text-left transition hover:text-[#0156ff]">
                  <span>{band}</span>
                  <span>1</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#eef2f7] pt-4">
            <div className="mb-3 font-semibold text-black">Color</div>
            <div className="flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-black ring-1 ring-[#d1d5db]" />
              <span className="h-5 w-5 rounded-full bg-[#db2777] ring-1 ring-[#d1d5db]" />
            </div>
          </div>

          <div className="border-t border-[#eef2f7] pt-4">
            <div className="mb-3 font-semibold text-black">Filter Name</div>
            <button className="w-full rounded bg-[#0156ff] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#0d63ff]">
              Apply Filters (2)
            </button>
          </div>

          <div className="border-t border-[#eef2f7] pt-4">
            <div className="mb-3 font-semibold text-black">Brands</div>
            <button className="mb-4 w-full rounded-full border border-[#cfd6e6] px-4 py-2 text-[12px] font-medium text-[#6b7280] transition hover:border-[#0156ff] hover:text-[#0156ff]">
              All Brands
            </button>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[18px] font-semibold italic text-[#777]">
              <span>ASUS</span>
              <span>msi</span>
              <span className="text-[14px] not-italic">thermaltake</span>
              <span className="not-italic">ADATA</span>
              <span className="text-[12px] not-italic">HEWLETT</span>
              <span className="not-italic">GIGABYTE</span>
            </div>
          </div>

          <div className="border-t border-[#eef2f7] pt-4">
            <div className="mb-3 font-semibold text-black">Compare Products</div>
            <p className="text-[#9ca3af]">You have no items to compare.</p>
          </div>

          <div className="border-t border-[#eef2f7] pt-4">
            <div className="mb-3 font-semibold text-black">My Wish List</div>
            <p className="mb-4 text-[#9ca3af]">You have no items in your wish list.</p>
            <div className="overflow-hidden rounded-sm bg-[#111827]">
              <div className="h-52 w-full bg-[linear-gradient(135deg,#111827_0%,#1f2937_45%,#ef4444_45%,#111827_100%)]" />
              <div className="px-4 py-3 text-white">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">noblechairs</p>
                <p className="mt-1 text-[28px] font-semibold leading-none">THE ICON SERIES</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedCategory = isValidCategory(resolvedSearchParams.category) ? resolvedSearchParams.category : undefined;
  const selectedSort = isValidSort(resolvedSearchParams.sort) ? resolvedSearchParams.sort : "featured";
  const requestedPage = getPageNumber(resolvedSearchParams.page);

  const [allProducts, filteredProducts] = await Promise.all([
    getCatalogProducts({ sort: selectedSort, limit: 120 }),
    getCatalogProducts({ category: selectedCategory, sort: selectedSort, limit: 120 }),
  ]);

  const products = selectedCategory ? filteredProducts : allProducts;
  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const categoryCounts = PRODUCT_CATEGORY_TAGS.reduce<Record<string, number>>((counts, category) => {
    counts[category] = allProducts.filter((product) => product.category === category).length;
    return counts;
  }, {});

  const visiblePagination = getVisiblePagination(currentPage, totalPages);
  const pageTitle = selectedCategory ? `${CATEGORY_LABELS[selectedCategory]} (${totalItems})` : `All Products (${totalItems})`;
  const pageStart = totalItems === 0 ? 0 : startIndex + 1;
  const pageEnd = Math.min(endIndex, totalItems);

  return (
    <main className="bg-white">
      <TopBar />
      <MainNavbar />

      <section className="mx-auto max-w-360 px-4 py-6 sm:px-6">
        <div className="mb-4 overflow-hidden rounded-sm bg-[#0f172a]">
          <div className="relative flex min-h-24 flex-col items-start justify-between gap-4 overflow-hidden px-5 py-6 text-white sm:px-7 lg:flex-row lg:items-center lg:px-10">
            <div className="absolute inset-y-0 right-0 w-80 bg-[linear-gradient(90deg,transparent,rgba(234,179,8,0.35),rgba(255,255,255,0.06))]" />
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.28em] text-white/60">ASUS</p>
              <h2 className="mt-1 text-[26px] font-bold tracking-[-0.04em] sm:text-[34px]">ASUS TUF GAMING FX505</h2>
              <p className="mt-1 text-[13px] font-medium uppercase tracking-[0.18em] text-[#facc15]">High Performance at an Affordable Price</p>
            </div>
            <button className="relative z-10 rounded-sm bg-black px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#0156ff]">
              Shop Now
            </button>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2 text-[11px] text-[#8b95a7]">
          <Link href="/" className="hover:text-[#0156ff]">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#0156ff]">Laptops</Link>
          <span>/</span>
          <span>Everyday Use Notebooks</span>
          <span>/</span>
          <span className="text-[#b3bac6]">{pageTitle}</span>
        </div>

        <h1 className="mb-5 text-[28px] font-semibold tracking-[-0.03em] text-black sm:text-[34px]">{pageTitle}</h1>

        <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
          <div className="xl:hidden">
            <details className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
              <summary className="cursor-pointer list-none px-4 py-3 text-[14px] font-semibold text-black">Filters & categories</summary>
              <div className="border-t border-[#eef2f7] p-4">
                <FilterSidebar selectedSort={selectedSort} categoryCounts={categoryCounts} />
              </div>
            </details>
          </div>

          <div className="hidden xl:block">
            <FilterSidebar selectedSort={selectedSort} categoryCounts={categoryCounts} />
          </div>

          <div>
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2 text-[12px]">
                <Link href="/products" className="text-black transition hover:text-[#0156ff]">&lt; Back</Link>
                <span className="ml-4 text-[#b3bac6]">Items {pageStart}-{pageEnd} of {totalItems}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {selectedCategory ? (
                  <div className="inline-flex items-center gap-2 rounded-sm border border-[#d9dde5] bg-white px-3 py-2 text-[11px] font-semibold text-[#3b4252]">
                    <span>{CATEGORY_LABELS[selectedCategory]}</span>
                    <X className="h-3.5 w-3.5 text-[#a0a7b3]" />
                  </div>
                ) : null}
                <Link href={buildProductsHref({ sort: selectedSort, page: 1 })} className="inline-flex items-center rounded-sm border border-[#d9dde5] px-3 py-2 text-[11px] font-semibold text-[#3b4252] transition hover:border-[#0156ff] hover:text-[#0156ff]">
                  Clear All
                </Link>
              </div>
            </div>

            <div className="mb-5 flex flex-col gap-3 border-y border-[#eef2f7] py-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[12px] text-[#8b95a7]">Sort By:</span>
                <form method="get" className="flex items-center gap-2">
                  {selectedCategory ? <input type="hidden" name="category" value={selectedCategory} /> : null}
                  <select name="sort" defaultValue={selectedSort} className="h-10 rounded-sm border border-[#d9dde5] bg-white px-4 pr-8 text-[12px] text-black">
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <input type="hidden" name="page" value="1" />
                  <button type="submit" className="hidden">Apply</button>
                </form>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-sm border border-[#d9dde5] px-4 py-2 text-[12px] text-black">
                  <span>Show:</span>
                  <span className="font-semibold">{ITEMS_PER_PAGE} per page</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#7b8394]" />
                </div>
                <button className="rounded-sm border border-[#d9dde5] p-2 text-[#7b8394] transition hover:border-[#0156ff] hover:text-[#0156ff]">
                  <Grid2x2 className="h-4 w-4" />
                </button>
                <button className="rounded-sm border border-[#d9dde5] p-2 text-[#7b8394] transition hover:border-[#0156ff] hover:text-[#0156ff]">
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {paginatedProducts.length > 0 ? (
              <>
                <section className="grid grid-cols-1 border-l border-t border-[#e7eef6] min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {paginatedProducts.map((product) => (
                    <ProductListingCard key={product.id} product={product} />
                  ))}
                </section>

                <div className="mt-8 flex items-center justify-center gap-2">
                  <Link href={buildProductsHref({ category: selectedCategory, sort: selectedSort, page: Math.max(1, currentPage - 1) })} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#cfd6e6] text-[#5f6670] transition hover:border-[#0156ff] hover:text-[#0156ff]">
                    <ChevronLeft className="h-4 w-4" />
                  </Link>

                  {visiblePagination.map((item, index) =>
                    item === "ellipsis" ? (
                      <span key={`ellipsis-${index}`} className="px-1 text-[#6b7280]">...</span>
                    ) : (
                      <Link
                        key={item}
                        href={buildProductsHref({ category: selectedCategory, sort: selectedSort, page: item })}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border text-[14px] font-semibold transition ${item === currentPage ? "border-transparent bg-[#f3f4f6] text-black" : "border-[#cfd6e6] text-[#5f6670] hover:border-[#0156ff] hover:text-[#0156ff]"}`}
                      >
                        {item}
                      </Link>
                    ),
                  )}

                  <Link href={buildProductsHref({ category: selectedCategory, sort: selectedSort, page: Math.min(totalPages, currentPage + 1) })} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#cfd6e6] text-[#5f6670] transition hover:border-[#0156ff] hover:text-[#0156ff]">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mx-auto mt-8 max-w-5xl text-center text-[12px] leading-[1.8] text-[#9ca3af]">
                  <p>
                    MSI has unveiled the Prestige Series of business-class and gaming notebooks, tuned for your accessory. The Prestige Series uses cutting-edge technology, while clearly standing out as one of the finest displays possible for both work and play.
                  </p>
                  <p className="mt-2">
                    These are the perfect systems for users demanding portability, speed, and modern display quality. Whether you are editing, browsing, or gaming, this catalog page gives you a clean overview of the most popular models available in our collection.
                  </p>
                  <button className="mt-5 rounded-full border border-[#cfd6e6] px-6 py-2 text-[12px] font-semibold text-[#4b5563] transition hover:border-[#0156ff] hover:text-[#0156ff]">
                    More
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                <p className="text-xl font-semibold text-slate-900">Mahsulot topilmadi</p>
                <p className="mt-2 text-sm text-slate-600">Filter yoki sortni o‘zgartirib qayta urinib ko‘ring.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <HomeBottomSections />
    </main>
  );
}
