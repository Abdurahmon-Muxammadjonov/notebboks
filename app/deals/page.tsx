import { MainNavbar } from "@/components/main-navbar";
import { TopBar } from "@/components/top-bar";
import { HomeBottomSections } from "@/components/home-bottom-sections";

const DEALS = [
  { title: "Weekend Laptop Flash Sale", text: "Save up to 35% on selected notebooks, gaming laptops and creative workstations.", accent: "from-[#0156ff] to-[#35a4ff]" },
  { title: "Accessory Combo Offers", text: "Grab keyboards, mice and headsets together for extra bundle savings.", accent: "from-[#111827] to-[#374151]" },
  { title: "Monitor Upgrade Week", text: "Special pricing for curved, ultrawide and gaming monitor collections.", accent: "from-[#7c3aed] to-[#c084fc]" },
];

export default function DealsPage() {
  return (
    <main className="bg-white">
      <TopBar />
      <MainNavbar />
      <section className="mx-auto max-w-360 px-4 py-10 sm:px-6">
        <div className="rounded-[28px] bg-[#0f172a] px-6 py-10 text-white sm:px-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-white/60">Hot campaigns</p>
          <h1 className="mt-3 text-[32px] font-bold tracking-[-0.04em] sm:text-[46px]">Our Deals</h1>
          <p className="mt-3 max-w-2xl text-[15px] text-white/75 sm:text-[17px]">Seasonal campaigns, bundle discounts and fresh promotions are collected here in one responsive hub.</p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {DEALS.map((deal) => (
            <article key={deal.title} className="overflow-hidden rounded-[28px] border border-[#e7eef6] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <div className={`h-34 bg-linear-to-br ${deal.accent}`} />
              <div className="p-6">
                <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-black">{deal.title}</h2>
                <p className="mt-3 text-[14px] leading-7 text-[#64748b]">{deal.text}</p>
                <button className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#0156ff] px-6 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0d63ff] hover:shadow-[0_12px_30px_rgba(1,86,255,0.28)]">Explore Offer</button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <HomeBottomSections />
    </main>
  );
}
