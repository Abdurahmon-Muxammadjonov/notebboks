import { CartPageContent } from "@/components/cart-page-content";
import { HomeBottomSections } from "@/components/home-bottom-sections";
import { MainNavbar } from "@/components/main-navbar";
import { TopBar } from "@/components/top-bar";

export default function CartPage() {
  return (
    <main className="bg-white">
      <TopBar />
      <MainNavbar />
      <CartPageContent />
      <HomeBottomSections />
    </main>
  );
}