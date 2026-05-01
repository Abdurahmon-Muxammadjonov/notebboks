"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { getCartCount, subscribeToCartCount } from "@/lib/cart";

export function CartBadge() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCartCount());
    return subscribeToCartCount(setCartCount);
  }, []);

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-5 w-5 text-black" strokeWidth={2} />
      {cartCount > 0 ? (
        <span className="absolute -right-2 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#0156ff] px-1 text-[10px] font-bold text-white">
          {cartCount}
        </span>
      ) : null}
    </Link>
  );
}