"use client";

import Link from "next/link";
import { CircleDollarSign, Headphones, MapPinCheckInside } from "lucide-react";
import { TestimonialSlider } from "@/components/testimonial-slider";
import { useAppPreferences } from "@/components/app-preferences-provider";

const footerColumns = [
  {
    title: "Information",
    links: [
      "About Us",
      "About Zip",
      "Privacy Policy",
      "Search",
      "Terms",
      "Orders and Returns",
      "Contact Us",
      "Advanced Search",
      "Newsletter Subscription",
    ],
  },
  {
    title: "PC Parts",
    links: [
      "CPUS",
      "Add On Cards",
      "Hard Drives (Internal)",
      "Graphic Cards",
      "Keyboards / Mice",
      "Cases / Power Supplies / Cooling",
      "RAM (Memory)",
      "Software",
      "Speakers / Headsets",
      "Motherboards",
    ],
  },
  {
    title: "Desktop PCs",
    links: ["Custom PCs", "Servers", "MSI All-In-One PCs", "HP/Compaq PCs", "ASUS PCs", "Tecs PCs"],
  },
  {
    title: "Laptops",
    links: [
      "Everyday Use Notebooks",
      "MSI Workstation Series",
      "MSI Prestige Series",
      "Tablets and Pads",
      "Netbooks",
      "Infinity Gaming Notebooks",
    ],
  },
];

const paymentBadges = ["PayPal", "VISA", "maestro", "mastercard", "Discover"];

const paymentLinks: Record<string, string> = {
  PayPal: "https://www.paypal.com/",
  VISA: "https://www.visa.com/",
  maestro: "https://www.mastercard.com/global/en/personal/find-a-card/maestro-cards.html",
  mastercard: "https://www.mastercard.com/",
  Discover: "https://www.discover.com/",
};

function SupportFeatures() {
  const { t } = useAppPreferences();
  const items = [
    {
      title: t("support.productSupport"),
      description: t("support.productSupportDesc"),
      icon: Headphones,
    },
    {
      title: t("support.personalAccount"),
      description: t("support.personalAccountDesc"),
      icon: MapPinCheckInside,
    },
    {
      title: t("support.amazingSavings"),
      description: t("support.amazingSavingsDesc"),
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="mx-auto mt-14 grid max-w-360 grid-cols-1 gap-8 px-4 pb-10 sm:px-6 md:mt-20 md:grid-cols-3 md:gap-12 md:pb-12">
      {items.map(({ title, description, icon: Icon }) => (
        <div
          key={title}
          className="group cursor-pointer rounded-2xl px-6 py-7 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_45px_rgba(17,24,39,0.10)]"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0156ff] text-white shadow-[0_10px_20px_rgba(1,86,255,0.20)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_16px_32px_rgba(1,86,255,0.30)]">
            <Icon className="h-7 w-7" />
          </div>
          <h3 className="mt-5 text-[22px] font-semibold tracking-[-0.02em] text-black transition-colors duration-300 group-hover:text-[#0156ff]">
            {title}
          </h3>
          <p className="mx-auto mt-3 text-[15px] leading-[1.45] text-[#7a7f87] transition-colors duration-300 group-hover:text-[#5f6670]" style={{ maxWidth: "250px" }}>
            {description}
          </p>
        </div>
      ))}
    </div>
  );
}

function NewsletterFooter() {
  const { t } = useAppPreferences();

  return (
    <footer className="app-footer">
      <div className="mx-auto max-w-360 px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-[34px] font-semibold tracking-[-0.04em] text-white sm:text-[42px] lg:text-[52px]">{t("footer.newsletterTitle")}</h2>
            <p className="mt-2 text-[16px] text-white/65">{t("footer.newsletterDesc")}</p>
          </div>

          <form className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-end" style={{ maxWidth: "620px" }}>
            <input
              type="email"
              placeholder={t("footer.yourEmail")}
              className="h-13 w-full rounded-sm border border-white/50 bg-transparent px-5 text-[15px] text-white placeholder:text-white/45 focus:border-[#0156ff] focus:outline-none"
            />
            <button className="inline-flex h-13 cursor-pointer items-center justify-center rounded-full bg-[#0156ff] px-8 text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0d63ff] hover:shadow-[0_12px_30px_rgba(1,86,255,0.35)] active:scale-[0.98]" style={{ minWidth: "150px" }}>
              {t("footer.subscribe")}
            </button>
          </form>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-2 xl:grid-cols-[1.1fr_1.4fr_1fr_1fr_1.5fr]">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-5 text-[14px] font-semibold text-white/55">{column.title === "Information" ? t("footer.information") : column.title}</h3>
              <ul className="space-y-2.5 text-[14px] text-white/78">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="inline-flex cursor-pointer transition-all duration-200 hover:translate-x-1 hover:text-[#0156ff]"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-5 text-[14px] font-semibold text-white/55">{t("footer.address")}</h3>
            <div className="space-y-2.5 text-[14px] leading-[1.6] text-white/78">
              <p>{t("footer.addressText")}</p>
              <p>
                {t("footer.phones")} <a href="tel:0012345678" className="cursor-pointer text-[#0156ff] transition-colors duration-200 hover:text-white">(00) 1234 5678</a>
              </p>
              <p>{t("footer.openHours1")}</p>
              <p>{t("footer.openHours2")}</p>
              <p>{t("footer.openHours3")}</p>
              <p>
                {t("footer.email")} <a href="mailto:shop@email.com" className="cursor-pointer text-[#0156ff] transition-colors duration-200 hover:text-white">shop@email.com</a>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-white/55">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-transparent p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5 hover:text-white"
              aria-label="Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-transparent p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5 hover:text-white"
              aria-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {paymentBadges.map((badge) => (
              <a
                key={badge}
                href={paymentLinks[badge]}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-7 cursor-pointer items-center justify-center rounded border border-white/15 bg-white px-2.5 text-[11px] font-semibold text-[#6b7280] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0156ff] hover:text-[#0156ff] hover:shadow-[0_10px_20px_rgba(1,86,255,0.18)]"
              >
                {badge}
              </a>
            ))}
          </div>

          <p className="text-[13px] text-white/45">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}

export function HomeBottomSections() {
  return (
    <>
      <section id="support" className="app-page scroll-mt-28 px-4 pb-8 pt-14 sm:px-6 sm:pb-10 sm:pt-18">
        <TestimonialSlider />
        <SupportFeatures />
      </section>
      <div id="newsletter" className="scroll-mt-28">
        <NewsletterFooter />
      </div>
    </>
  );
}
