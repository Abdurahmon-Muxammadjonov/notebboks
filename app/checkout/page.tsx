import { CheckoutPageContent } from "@/components/checkout-page-content";
import { HomeBottomSections } from "@/components/home-bottom-sections";
import { MainNavbar } from "@/components/main-navbar";
import { TopBar } from "@/components/top-bar";

export default function CheckoutPage() {
  return (
    <main className="bg-white">
      <TopBar />
      <MainNavbar />
      <CheckoutPageContent />
      <HomeBottomSections />
    </main>
  );
}