import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Heart, Share2, Star } from "lucide-react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { MainNavbar } from "@/components/main-navbar";
import { TopBar } from "@/components/top-bar";
import { HomeBottomSections } from "@/components/home-bottom-sections";
import { getCatalogProducts, getProductById } from "@/lib/products";

const CATEGORY_LABELS: Record<string, string> = {
  PCcorpuse: "PC Corpuses",
  Monitor: "Monitors",
  Notebook: "Notebooks",
};

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = (
    await getCatalogProducts({ category: typeof product.category === "string" ? product.category : undefined, limit: 8 })
  ).filter((item) => item.id !== product.id).slice(0, 4);

  const categoryLabel = product.category ? CATEGORY_LABELS[product.category] ?? product.category : "Products";

  return (
    <main className="bg-white">
      <TopBar />
      <MainNavbar />

      <section className="mx-auto max-w-360 px-4 py-8 sm:px-6">
        <div className="mb-4 flex items-center gap-2 text-[11px] text-[#8b95a7]">
          <Link href="/" className="hover:text-[#0156ff]">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#0156ff]">Products</Link>
          <span>/</span>
          <Link href={product.category ? `/products?category=${encodeURIComponent(product.category)}` : "/products"} className="hover:text-[#0156ff]">
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-[#b3bac6]">{product.name}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div className="rounded-sm border border-[#e7eef6] bg-white p-4 sm:p-6">
            <div className="flex items-center justify-center rounded-sm bg-[#f8fafc] p-5 sm:p-8" style={{ minHeight: "320px" }}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-auto object-contain" style={{ maxHeight: "420px" }} />
              ) : (
                <div className="text-sm text-slate-400">No image</div>
              )}
            </div>
          </div>

          <div className="rounded-sm border border-[#e7eef6] bg-white p-5 sm:p-8">
            <div className="mb-3 flex items-center gap-2 text-[#78a962]">
              <CheckCircle2 className="h-4 w-4 fill-current" />
              <span className="text-[13px] font-medium">in stock</span>
            </div>

            <h1 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] text-black sm:text-[34px]">{product.name}</h1>

            <div className="mt-4 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${index < product.rating ? "fill-[#f7b500] text-[#f7b500]" : "fill-[#d9dde5] text-[#d9dde5]"}`}
                />
              ))}
              <span className="ml-2 text-[13px] text-[#a2a6b0]">Reviews ({product.reviewsCount})</span>
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-3 sm:gap-4">
              <p className="text-[30px] font-semibold tracking-[-0.04em] text-black sm:text-[38px]">{formatPrice(product.price)}</p>
              <p className="pb-1 text-[18px] text-[#8c8c8c] line-through">{formatPrice(product.price + 200)}</p>
            </div>

            <p className="mt-6 text-[15px] leading-[1.75] text-[#4b5563]">
              {product.description ?? `${product.name} delivers excellent performance for everyday use, office work, and entertainment. It combines reliable hardware, modern styling, and practical portability for users who need a smooth experience across work and play.`}
            </p>

            <div className="mt-8 grid gap-3 text-[14px] text-[#4b5563]">
              <div className="flex flex-wrap justify-between gap-2 border-b border-[#eef2f7] pb-3"><span>SKU</span><span className="font-medium text-black">{product.id}</span></div>
              <div className="flex flex-wrap justify-between gap-2 border-b border-[#eef2f7] pb-3"><span>Category</span><span className="font-medium text-black">{categoryLabel}</span></div>
              <div className="flex flex-wrap justify-between gap-2 border-b border-[#eef2f7] pb-3"><span>Availability</span><span className="font-medium text-black">In Stock</span></div>
              <div className="flex flex-wrap justify-between gap-2 border-b border-[#eef2f7] pb-3"><span>Reviews</span><span className="font-medium text-black">{product.reviewsCount}</span></div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  category: categoryLabel,
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0156ff] px-7 text-[14px] font-semibold text-white transition hover:bg-[#0d63ff] hover:shadow-[0_12px_30px_rgba(1,86,255,0.28)]"
              />
              <button className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d9dde5] text-[#4b5563] transition hover:border-[#0156ff] hover:text-[#0156ff]">
                <Heart className="h-4 w-4" />
              </button>
              <button className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d9dde5] text-[#4b5563] transition hover:border-[#0156ff] hover:text-[#0156ff]">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 ? (
          <div className="mt-12">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-black">Related Products</h2>
              <Link href={product.category ? `/products?category=${encodeURIComponent(product.category)}` : "/products"} className="text-[15px] font-medium text-[#0156ff] underline underline-offset-4">
                See All Products
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((item) => (
                <Link key={item.id} href={`/products/${item.id}`} className="group rounded-sm border border-[#e7eef6] bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 flex h-44 items-center justify-center rounded-sm bg-[#f8fafc] p-4">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="text-sm text-slate-400">No image</div>
                    )}
                  </div>
                  <h3 className="line-clamp-2 min-h-12 text-[15px] font-medium text-black transition-colors duration-200 group-hover:text-[#0156ff]">{item.name}</h3>
                  <p className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-black">{formatPrice(item.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <HomeBottomSections />
    </main>
  );
}