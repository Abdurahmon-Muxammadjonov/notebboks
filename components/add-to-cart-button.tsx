"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { useAppPreferences } from "@/components/app-preferences-provider";
import { addCartItem, decrementCartItem, getCartItems, incrementCartItem, subscribeToCart } from "@/lib/cart";

type AddToCartButtonProps = {
  className?: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
    category?: string | null;
  };
};

export function AddToCartButton({ className, product }: AddToCartButtonProps) {
  const { t } = useAppPreferences();
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const syncQuantity = () => {
      const cartItem = getCartItems().find((item) => item.id === product.id);
      setQuantity(cartItem?.quantity ?? 0);
    };

    syncQuantity();
    return subscribeToCart(() => syncQuantity());
  }, [product.id]);

  function handleAddToCart() {
    addCartItem(product, 1);
  }

  function handleIncrement() {
    incrementCartItem(product.id, 1);
  }

  function handleDecrement() {
    decrementCartItem(product.id, 1, 1);
  }

  const defaultButtonClassName =
    "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0156ff] px-7 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0d63ff] hover:shadow-[0_12px_30px_rgba(1,86,255,0.28)] active:scale-[0.98]";

  if (quantity > 0) {
    return (
      <div className="inline-flex h-12 items-center rounded-full bg-[#0156ff] px-2 text-white shadow-[0_12px_30px_rgba(1,86,255,0.24)]">
        <button
          type="button"
          onClick={handleDecrement}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-300 hover:bg-white/12 active:scale-95"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-10 text-center text-[15px] font-semibold">{quantity}</span>
        <button
          type="button"
          onClick={handleIncrement}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-300 hover:bg-white/12 active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className={`${defaultButtonClassName} cursor-pointer ${className ?? ""}`.trim()}
    >
      <ShoppingCart className="h-4 w-4" />
      {t("common.cart")}
    </button>
  );
}