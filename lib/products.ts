import { createSupabaseBrowserlessClient } from "@/lib/supabase";

export const PRODUCT_CATEGORY_TAGS = ["PCcorpuse", "Monitor", "Notebook"] as const;

export type ProductCategoryTag = (typeof PRODUCT_CATEGORY_TAGS)[number];
export type CatalogSort = "featured" | "newest" | "price_asc" | "price_desc" | "name_asc";

export type ProductItem = {
  id: string;
  name: string;
  description?: string | null;
  category?: ProductCategoryTag | string | null;
  price: number;
  oldPrice?: number | null;
  imageUrl?: string | null;
  rating: number;
  reviewsCount: number;
  stockStatus: "in_stock" | "check_availability";
};

type SupabaseProductRow = {
  id: string | number;
  name: string;
  description?: string | null;
  category?: string | null;
  price: number;
  image_url?: string | null;
  stock_quantity?: number | null;
};

function normalizeProduct(row: SupabaseProductRow): ProductItem {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description ?? null,
    category: row.category ?? null,
    price: row.price,
    oldPrice: null,
    imageUrl: row.image_url ?? null,
    rating: 4,
    reviewsCount: 4,
    stockStatus: (row.stock_quantity ?? 0) > 0 ? "in_stock" : "check_availability",
  };
}

function isProductCategoryTag(value: string): value is ProductCategoryTag {
  return PRODUCT_CATEGORY_TAGS.includes(value as ProductCategoryTag);
}

type GetCatalogProductsOptions = {
  category?: string | null;
  sort?: CatalogSort;
  limit?: number;
};

export async function getCatalogProducts({ category, sort = "featured", limit = 60 }: GetCatalogProductsOptions = {}) {
  const supabase = createSupabaseBrowserlessClient();

  if (!supabase) {
    return [];
  }

  const normalizedCategory = category?.trim();
  let query = supabase.from("products").select("id, name, description, category, price, image_url, stock_quantity");

  if (normalizedCategory && isProductCategoryTag(normalizedCategory)) {
    query = query.eq("category", normalizedCategory);
  } else {
    query = query.in("category", PRODUCT_CATEGORY_TAGS);
  }

  if (sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else if (sort === "name_asc") {
    query = query.order("name", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query.limit(limit);

  if (error || !data?.length) {
    return [];
  }

  return data.map((row) => normalizeProduct(row as SupabaseProductRow));
}

export async function getProductsByTags(tags: ProductCategoryTag[] = [...PRODUCT_CATEGORY_TAGS]): Promise<ProductItem[]> {
  const supabase = createSupabaseBrowserlessClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, category, price, image_url, stock_quantity")
    .in("category", tags)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error || !data?.length) {
    return [];
  }

  return data.map((row) => normalizeProduct(row as SupabaseProductRow));
}

export async function getProductById(id: string): Promise<ProductItem | null> {
  const supabase = createSupabaseBrowserlessClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, category, price, image_url, stock_quantity")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return normalizeProduct(data as SupabaseProductRow);
}

export async function getProducts(): Promise<ProductItem[]> {
  return getCatalogProducts({});
}
