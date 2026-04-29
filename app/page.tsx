import { Product } from "@/components/product";
import { Hero } from "@/components/hero";
import { MainNavbar } from "@/components/main-navbar";
import { TopBar } from "@/components/top-bar";
import { getProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="bg-white">
      <TopBar />
      <MainNavbar />
      <Hero />
      <Product products={products} />
    </main>
  );
}
