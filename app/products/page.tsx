import Link from "next/link";

import {
  PRODUCT_CATEGORY_TAGS,
  type CatalogSort,
  getCatalogProducts,
} from "@/lib/products";

const SORT_OPTIONS: Array<{ value: CatalogSort; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A-Z" },
];

const CATEGORY_LABELS: Record<string, string> = {
  PCcorpuse: "PC Corpuses",
  Monitor: "Monitors",
  Notebook: "Notebooks",
};

type ProductsPageProps = {
  searchParams?: Promise<{
    category?: string;
    sort?: string;
  }>;
};

function isValidSort(value?: string): value is CatalogSort {
  return SORT_OPTIONS.some((option) => option.value === value);
}

function isValidCategory(value?: string): value is (typeof PRODUCT_CATEGORY_TAGS)[number] {
  return PRODUCT_CATEGORY_TAGS.includes(value as (typeof PRODUCT_CATEGORY_TAGS)[number]);
}

function buildProductsHref(category?: string, sort?: string) {
  const params = new URLSearchParams();

  if (category && isValidCategory(category)) {
    params.set("category", category);
  }

  if (sort && isValidSort(sort) && sort !== "featured") {
    params.set("sort", sort);
  }

  const queryString = params.toString();

  return queryString ? `/products?${queryString}` : "/products";
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedCategory = isValidCategory(resolvedSearchParams.category) ? resolvedSearchParams.category : undefined;
  const selectedSort = isValidSort(resolvedSearchParams.sort) ? resolvedSearchParams.sort : "featured";
  const products = await getCatalogProducts({
    category: selectedCategory,
    sort: selectedSort,
    limit: 100,
  });

  const pageTitle = selectedCategory ? CATEGORY_LABELS[selectedCategory] : "All Products";

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{pageTitle}</h1>
          <p className="mt-1 text-sm text-slate-500">{products.length} ta mahsulot topildi</p>
        </div>

        <form method="get" className="flex items-center gap-3">
          {selectedCategory ? <input type="hidden" name="category" value={selectedCategory} /> : null}
          <label htmlFor="sort" className="text-sm text-slate-600">
            Sort by
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={selectedSort}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Apply
          </button>
        </form>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href={buildProductsHref(undefined, selectedSort)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            !selectedCategory ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          All
        </Link>
        {PRODUCT_CATEGORY_TAGS.map((category) => (
          <Link
            key={category}
            href={buildProductsHref(category, selectedSort)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedCategory === category ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {CATEGORY_LABELS[category]}
          </Link>
        ))}
      </div>

      {products.length > 0 ? (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-44 items-center justify-center rounded-lg bg-slate-50 p-3">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="max-h-full w-auto object-contain" />
                ) : (
                  <div className="text-sm text-slate-400">No image</div>
                )}
              </div>

              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {product.category ? CATEGORY_LABELS[product.category] ?? product.category : "No category"}
              </p>
              <h2 className="line-clamp-2 min-h-12 text-base font-semibold text-slate-900">{product.name}</h2>
              <p className="mt-3 text-2xl font-bold text-slate-900">${product.price.toFixed(2)}</p>
            </article>
          ))}
        </section>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
          <p className="text-xl font-semibold text-slate-900">Mahsulot topilmadi</p>
          <p className="mt-2 text-sm text-slate-600">Filter yoki sortni o‘zgartirib qayta urinib ko‘ring.</p>
        </div>
      )}
    </main>
  );
}
