import Link from "next/link";
import { Menu, Search, ShoppingCart } from "lucide-react";

const links = [
  "Laptops",
  "Desktop PCs",
  "Networking Devices",
  "Printers & Scanners",
  "PC Parts",
  "All Other Products",
  "Repairs",
];

export function MainNavbar() {
  return (
    <header className="border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-7">
        <div className="flex items-center gap-8 xl:gap-10">
          <button className="lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex h-11 w-11 items-center justify-center text-[#0156ff]">
            <div className="relative h-10 w-10">
              <div className="absolute left-1 top-0 h-4 w-7 skew-x-[-24deg] rounded-sm bg-[#0156ff]" />
              <div className="absolute left-1 top-3 h-4 w-7 skew-x-[-24deg] rounded-sm border-2 border-[#0156ff] bg-white" />
              <div className="absolute left-4 top-6 h-3 w-4 skew-x-[-24deg] rounded-sm bg-[#0156ff]" />
            </div>
          </Link>

          <nav className="hidden items-center gap-5 xl:gap-8 lg:flex">
            {links.map((link) => (
              <a key={link} href="#" className="whitespace-nowrap text-[15px] font-semibold text-[#1a1a1a] transition hover:text-[#0156ff]">
                {link}
              </a>
            ))}
            <Link
              href="/deals"
              className="rounded-full border-2 border-[#0156ff] px-6 py-2.5 text-[15px] font-semibold text-[#0156ff]"
            >
              Our Deals
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-5 text-sm text-slate-700">
          <Search className="h-[18px] w-[18px] stroke-[2.2] text-black" />
          <Link href="/products" className="relative">
            <ShoppingCart className="h-[21px] w-[21px] stroke-[2.2] text-black" />
            <span className="absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#0156ff] text-[10px] font-semibold text-white shadow-sm">
              2
            </span>
          </Link>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f0fe] text-xs font-bold text-[#0156ff]">
            MK
          </div>
        </div>
      </div>
    </header>
  );
}
