import { ChevronDown, MapPin } from "lucide-react";

export function TopBar() {
  return (
    <div className="w-full bg-black px-4 text-[11px] text-white md:text-xs">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
        <div className="flex items-center gap-1 font-medium tracking-wide text-white/95">
          <span>Mon–Thu: 9:00 AM - 5:30 PM</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </div>

        <div className="flex items-center gap-2 text-center text-white/85">
          <MapPin className="hidden h-3.5 w-3.5 sm:block" />
          <span>Visit our showroom in 1234 Street Address City Address, 1234</span>
          <a href="#" className="border-b border-white pb-px font-semibold text-white">
            Contact Us
          </a>
        </div>

        <div className="flex items-center gap-4 font-medium">
          <span>Call Us: (00) 1234 5678</span>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-white/90">
            <span>fb</span>
            <span>ig</span>
          </div>
        </div>
      </div>
    </div>
  );
}
