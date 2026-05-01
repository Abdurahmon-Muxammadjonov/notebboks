"use client";

import { NewProductsSlider } from "@/components/new-products-slider";
import { CategorySectionClient } from "@/components/category-section-client";
import { useAppPreferences } from "@/components/app-preferences-provider";

import type { ProductItem } from "@/lib/products";

type CategoryGroup = {
  category: string;
  tag: string;
  products: ProductItem[];
};

type ProductSectionProps = {
  newProducts: ProductItem[];
  categoryGroups: CategoryGroup[];
};

function CategorySection({ category, tag, products }: CategoryGroup) {
  const categoryHref = `/products?category=${encodeURIComponent(tag)}`;
  const sectionIdMap: Record<string, string> = {
    Notebook: "notebooks",
    PCcorpuse: "pc-corpuses",
    Monitor: "monitors",
  };

  return (
    <CategorySectionClient
      sectionId={sectionIdMap[tag] ?? tag.toLowerCase()}
      category={category}
      products={products}
      categoryHref={categoryHref}
    />
  );
}

export function Product({ newProducts, categoryGroups }: ProductSectionProps) {
  const { t } = useAppPreferences();

  return (
    <section className="mx-auto max-w-360 px-3 pb-12 pt-2 sm:px-4 sm:pb-16">
      {newProducts.length > 0 ? <NewProductsSlider products={newProducts} /> : null}

      {categoryGroups.length > 0 ? (
        <div className="space-y-6 pb-2">
          {categoryGroups.map((group) => (
            <CategorySection
              key={group.category}
              category={group.category}
              tag={group.tag}
              products={group.products}
            />
          ))}
        </div>
      ) : newProducts.length === 0 ? (
        <div className="flex min-h-70 items-center justify-center px-6 py-12 text-center">
          <div>
            <p className="app-heading text-2xl font-semibold">{t("product.noProductsFound")}</p>
            <p className="app-muted mt-3 text-[16px]">
              {t("product.supabaseEmpty")}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
