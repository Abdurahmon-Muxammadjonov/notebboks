import { Product } from "@/components/product";
import { Hero } from "@/components/hero";
import { MainNavbar } from "@/components/main-navbar";
import { TopBar } from "@/components/top-bar";
import { getCatalogProducts, getProducts } from "@/lib/products";
import { BrandLogos } from "@/components/brand-logos";
import { InstagramFeed } from "@/components/instagram-feed";
import { HomeBottomSections } from "@/components/home-bottom-sections";

export default async function HomePage() {
  const [newProducts, notebooks, corpuses, monitors] = await Promise.all([
    getProducts(),
    getCatalogProducts({ category: "Notebook", limit: 20 }),
    getCatalogProducts({ category: "PCcorpuse", limit: 20 }),
    getCatalogProducts({ category: "Monitor", limit: 20 }),
  ]);

  const categoryGroups = [
    { category: "Notebooks", tag: "Notebook", products: notebooks },
    { category: "PC Corpuses", tag: "PCcorpuse", products: corpuses },
    { category: "Monitors", tag: "Monitor", products: monitors },
  ].filter((g) => g.products.length > 0);

  return (
    <main className="bg-white">
      <TopBar />
      <MainNavbar />
      <Hero />
      <Product newProducts={newProducts} categoryGroups={categoryGroups} />
      <BrandLogos />
      <InstagramFeed />
      <HomeBottomSections />
    </main>
  );
}
