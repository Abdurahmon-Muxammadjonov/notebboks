"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Minus, Plus, X } from "lucide-react";
import * as yup from "yup";

import { CartItem, clearCart, decrementCartItem, getCartItems, incrementCartItem, removeCartItem, subscribeToCart } from "@/lib/cart";
import { getAppliedPromoCode, isValidPromoCode, PROMO_CODE, PROMO_DISCOUNT_RATE, setAppliedPromoCode, subscribeToPromoCode } from "@/lib/promo";

type ShippingFormValues = {
  country: string;
  stateProvince: string;
  zipCode: string;
};

type ShippingField = keyof ShippingFormValues;
type ShippingErrors = Partial<Record<ShippingField, string>>;
type FeedbackState = { type: "success" | "error"; text: string } | null;

const shippingSchema = yup.object({
  country: yup.string().trim().required("Country tanlang."),
  stateProvince: yup.string().trim().required("State/Province maydonini to‘ldiring.").min(2, "Kamida 2 ta belgi kiriting."),
  zipCode: yup
    .string()
    .trim()
    .required("Zip/Postal Code majburiy.")
    .matches(/^[A-Za-z0-9\-\s]{4,10}$/, "Zip/Postal Code noto‘g‘ri formatda."),
});

const discountSchema = yup.object({
  discountCode: yup
    .string()
    .trim()
    .required("Discount code kiriting.")
    .min(4, "Discount code kamida 4 ta belgidan iborat bo‘lsin."),
});

const baseInputClass =
  "h-10 w-full rounded-sm border bg-white px-3 text-[12px] text-black outline-none transition-all duration-300 placeholder:text-[#9ca3af]";

function mapShippingErrors(error: yup.ValidationError) {
  const nextErrors: ShippingErrors = {};

  for (const issue of error.inner) {
    if (!issue.path || nextErrors[issue.path as ShippingField]) {
      continue;
    }

    nextErrors[issue.path as ShippingField] = issue.message;
  }

  if (error.path && !nextErrors[error.path as ShippingField]) {
    nextErrors[error.path as ShippingField] = error.message;
  }

  return nextErrors;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

export function CartPageContent() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingForm, setShippingForm] = useState<ShippingFormValues>({
    country: "Australia",
    stateProvince: "",
    zipCode: "",
  });
  const [discountCode, setDiscountCode] = useState("");
  const [shippingErrors, setShippingErrors] = useState<ShippingErrors>({});
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [shippingFeedback, setShippingFeedback] = useState<FeedbackState>(null);
  const [discountFeedback, setDiscountFeedback] = useState<FeedbackState>(null);
  const [shippingAnimationKey, setShippingAnimationKey] = useState(0);
  const [discountAnimationKey, setDiscountAnimationKey] = useState(0);
  const [checkoutButtonPulse, setCheckoutButtonPulse] = useState(false);
  const [discountButtonPulse, setDiscountButtonPulse] = useState(false);
  const [appliedPromoCode, setAppliedPromoCodeState] = useState("");

  useEffect(() => {
    setCartItems(getCartItems());
    return subscribeToCart(setCartItems);
  }, []);

  useEffect(() => {
    setDiscountCode(getAppliedPromoCode());
    setAppliedPromoCodeState(getAppliedPromoCode());
    return subscribeToPromoCode((code) => {
      setAppliedPromoCodeState(code);
      setDiscountCode(code);
    });
  }, []);

  useEffect(() => {
    if (!checkoutButtonPulse) {
      return;
    }

    const timer = window.setTimeout(() => setCheckoutButtonPulse(false), 550);
    return () => window.clearTimeout(timer);
  }, [checkoutButtonPulse]);

  useEffect(() => {
    if (!discountButtonPulse) {
      return;
    }

    const timer = window.setTimeout(() => setDiscountButtonPulse(false), 550);
    return () => window.clearTimeout(timer);
  }, [discountButtonPulse]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = cartCount > 0 ? 21 : 0;
  const tax = subtotal * 0.1;
  const orderTotal = subtotal + shipping + tax;
  const discountAmount = appliedPromoCode ? orderTotal * PROMO_DISCOUNT_RATE : 0;
  const finalOrderTotal = Math.max(0, orderTotal - discountAmount);

  const handleShippingChange = (field: ShippingField, value: string) => {
    setShippingForm((current) => ({ ...current, [field]: value }));
    setShippingErrors((current) => ({ ...current, [field]: undefined }));
    setShippingFeedback(null);
  };

  const handleDiscountChange = (value: string) => {
    setDiscountCode(value);
    setDiscountError(null);
    setDiscountFeedback(null);
  };

  const applyPromoCode = async (code: string) => {
    const normalizedCode = code.trim().toUpperCase();

    try {
      await discountSchema.validate({ discountCode: normalizedCode }, { abortEarly: false });

      if (!isValidPromoCode(normalizedCode)) {
        const message = `Promo code is not valid. Try ${PROMO_CODE}.`;
        setDiscountError(message);
        setDiscountFeedback({ type: "error", text: message });
        setDiscountAnimationKey((current) => current + 1);
        setDiscountButtonPulse(true);
        return;
      }

      setAppliedPromoCodeState(setAppliedPromoCode(normalizedCode));
      setDiscountCode(normalizedCode);
      setDiscountError(null);
      setDiscountFeedback({
        type: "success",
        text: `${PROMO_CODE} applied successfully. You now get 50% off your full order total.`,
      });
      setDiscountAnimationKey((current) => current + 1);
      setDiscountButtonPulse(true);
    } catch (error) {
      if (!(error instanceof yup.ValidationError)) {
        return;
      }

      const firstMessage = error.inner[0]?.message ?? error.message;
      setDiscountError(firstMessage);
      setDiscountFeedback({
        type: "error",
        text: firstMessage,
      });
      setDiscountAnimationKey((current) => current + 1);
      setDiscountButtonPulse(true);
    }
  };

  const handleCheckout = async () => {
    if (cartCount === 0) {
      setShippingFeedback({
        type: "error",
        text: "Checkout qilishdan oldin kamida bitta mahsulot qo‘shing.",
      });
      setShippingAnimationKey((current) => current + 1);
      setCheckoutButtonPulse(true);
      return;
    }

    try {
      await shippingSchema.validate(shippingForm, { abortEarly: false });
      setShippingErrors({});
      setShippingFeedback({
        type: "success",
        text: "Ma’lumotlar tayyor. Checkout sahifasiga o‘tyapsiz.",
      });
      setShippingAnimationKey((current) => current + 1);
      setCheckoutButtonPulse(true);
      window.setTimeout(() => {
        router.push("/checkout");
      }, 250);
    } catch (error) {
      if (!(error instanceof yup.ValidationError)) {
        return;
      }

      setShippingErrors(mapShippingErrors(error));
      setShippingFeedback({
        type: "error",
        text: "Davom etishdan oldin country, state/province va zip code maydonlarini to‘ldiring.",
      });
      setShippingAnimationKey((current) => current + 1);
      setCheckoutButtonPulse(true);
    }
  };

  const handleApplyDiscount = async () => {
    await applyPromoCode(discountCode);
  };

  return (
    <section className="mx-auto max-w-360 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-4 flex items-center gap-2 text-[11px] text-[#8b95a7]">
        <Link href="/" className="hover:text-[#0156ff]">Home</Link>
        <span>/</span>
        <span className="text-[#b3bac6]">Shopping Cart</span>
      </div>

      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-black sm:text-[34px]">Shopping Cart</h1>
          <p className="mt-1 text-[14px] text-[#8b95a7]">{cartCount} item(s) in your cart</p>
        </div>
        <Link href="/products" className="text-[14px] font-medium text-[#0156ff] underline underline-offset-4">
          Continue Shopping
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.72fr]">
        <div>
          <div className="overflow-hidden rounded-sm border border-[#e7eef6] bg-white">
          <div className="hidden grid-cols-[1.6fr_0.5fr_0.42fr_0.55fr_42px] border-b border-[#eef2f7] bg-[#fafbfc] px-6 py-4 text-[12px] font-semibold text-[#7b8394] lg:grid">
            <span>Product</span>
            <span>Price</span>
            <span>Qty</span>
            <span>Total</span>
            <span />
          </div>

          {cartItems.length > 0 ? (
            <div>
              {cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-1 gap-4 border-b border-[#eef2f7] px-4 py-5 last:border-b-0 sm:px-6 lg:grid-cols-[1.6fr_0.5fr_0.42fr_0.55fr_42px] lg:items-center lg:gap-4 lg:py-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-sm bg-[#f8fafc] p-3">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="max-h-full w-auto object-contain" />
                      ) : (
                        <div className="text-xs text-slate-400">No image</div>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b95a7]">{item.category ?? "Products"}</p>
                      <h2 className="mt-1 text-[14px] font-semibold leading-normal text-black">{item.name}</h2>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b95a7] lg:hidden">Price</span>
                    <p className="text-[16px] font-semibold text-black">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center justify-between lg:block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b95a7] lg:hidden">Quantity</span>
                    <div className="flex w-fit items-center rounded-sm border border-[#d9dde5] bg-white px-1 py-1">
                    <button
                      type="button"
                      onClick={() => decrementCartItem(item.id, 1, 1)}
                      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-[#4b5563] transition-all duration-200 hover:bg-[#f3f4f6] hover:text-[#0156ff] active:scale-95"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-8 text-center text-[14px] font-semibold text-black">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => incrementCartItem(item.id, 1)}
                      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-[#4b5563] transition-all duration-200 hover:bg-[#f3f4f6] hover:text-[#0156ff] active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  </div>

                  <div className="flex items-center justify-between lg:block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b95a7] lg:hidden">Total</span>
                    <p className="text-[16px] font-semibold text-black">{formatPrice(item.price * item.quantity)}</p>
                  </div>

                  <div className="flex justify-end lg:block">
                    <button
                      type="button"
                      onClick={() => removeCartItem(item.id)}
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#d9dde5] text-[#b1b7c3] transition-all duration-200 hover:border-[#ef4444] hover:text-[#ef4444] active:scale-95"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-14 text-center sm:py-18">
              <p className="text-[22px] font-semibold text-black">Your cart is empty</p>
              <p className="mt-2 text-[14px] text-[#8b95a7]">Add a product to see it here.</p>
            </div>
          )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/products" className="inline-flex h-10 items-center justify-center rounded-full border border-[#cfd6e6] px-5 text-[12px] font-semibold text-[#6b7280] transition hover:border-[#0156ff] hover:text-[#0156ff]">
                Continue Shopping
              </Link>
              <button type="button" onClick={() => clearCart()} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-black px-5 text-[12px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1f2937] active:scale-[0.98]">
                Clear Shopping Cart
              </button>
            </div>
            <button className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-black px-5 text-[12px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1f2937] active:scale-[0.98]">
              Update Shopping Cart
            </button>
          </div>
        </div>

        <div className="rounded-sm border border-[#e7eef6] bg-[#f8fafc] p-5 sm:p-6">
          <h2 className="text-[28px] font-semibold text-black">Summary</h2>
          <div className="mt-4 border-b border-[#e4e8ef] pb-5">
            <div className="mb-3 flex items-center justify-between text-[13px] font-medium text-black">
              <span>Estimate Shipping and Tax</span>
              <span>-</span>
            </div>
            <p className="text-[12px] text-[#8b95a7]">Enter your destination to get a shipping estimate.</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-black">Country</label>
                <select
                  value={shippingForm.country}
                  onChange={(event) => handleShippingChange("country", event.target.value)}
                  className={`${baseInputClass} ${shippingErrors.country ? "animate-field-error border-[#ef4444] ring-4 ring-[#fee2e2]" : "border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]"}`}
                >
                  <option>Australia</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                </select>
                {shippingErrors.country ? <p className="mt-1 text-[11px] text-[#dc2626]">{shippingErrors.country}</p> : null}
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-black">State/Province</label>
                <input
                  value={shippingForm.stateProvince}
                  onChange={(event) => handleShippingChange("stateProvince", event.target.value)}
                  className={`${baseInputClass} ${shippingErrors.stateProvince ? "animate-field-error border-[#ef4444] ring-4 ring-[#fee2e2]" : "border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]"}`}
                  placeholder="Masalan: Tashkent"
                />
                {shippingErrors.stateProvince ? <p className="mt-1 text-[11px] text-[#dc2626]">{shippingErrors.stateProvince}</p> : null}
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-black">Zip/Postal Code</label>
                <input
                  value={shippingForm.zipCode}
                  onChange={(event) => handleShippingChange("zipCode", event.target.value)}
                  className={`${baseInputClass} ${shippingErrors.zipCode ? "animate-field-error border-[#ef4444] ring-4 ring-[#fee2e2]" : "border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]"}`}
                  placeholder="Masalan: 100047"
                />
                {shippingErrors.zipCode ? <p className="mt-1 text-[11px] text-[#dc2626]">{shippingErrors.zipCode}</p> : null}
              </div>
            </div>

            {shippingFeedback ? (
              <div
                key={`shipping-feedback-${shippingAnimationKey}`}
                className={`mt-4 flex items-start gap-2 rounded-2xl border px-3 py-3 text-[12px] shadow-sm animate-feedback-in ${
                  shippingFeedback.type === "success"
                    ? "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]"
                    : "border-[#fecaca] bg-[#fef2f2] text-[#dc2626]"
                }`}
              >
                {shippingFeedback.type === "success" ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <p>{shippingFeedback.text}</p>
              </div>
            ) : null}
          </div>

          <div className="mt-5 border-b border-[#e4e8ef] pb-5">
            <div className="mb-3 flex items-center justify-between text-[13px] font-medium text-black">
              <span>Apply Discount Code</span>
              <span>-</span>
            </div>
            <input
              value={discountCode}
              onChange={(event) => handleDiscountChange(event.target.value)}
              placeholder="Enter discount code"
              className={`${baseInputClass} ${discountError ? "animate-field-error border-[#ef4444] ring-4 ring-[#fee2e2]" : "border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]"}`}
            />
            {discountError ? <p className="mt-1 text-[11px] text-[#dc2626]">{discountError}</p> : null}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#64748b]">
              <span>Use promo:</span>
              <button
                type="button"
                onClick={() => applyPromoCode(PROMO_CODE)}
                className="cursor-pointer rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1 font-semibold text-[#0156ff] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0156ff] hover:bg-[#dbeafe] active:scale-[0.98]"
              >
                Promocode: {PROMO_CODE}
              </button>
              {appliedPromoCode ? <span className="font-medium text-[#15803d]">Applied</span> : null}
            </div>
            <button
              type="button"
              onClick={handleApplyDiscount}
              className={`mt-4 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full border-2 border-[#0156ff] bg-white px-6 text-[13px] font-semibold text-[#0156ff] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0156ff] hover:text-white hover:shadow-[0_12px_28px_rgba(1,86,255,0.2)] active:scale-[0.98] ${discountButtonPulse ? "animate-button-bounce" : ""}`}
            >
              Apply Discount
            </button>

            {discountFeedback ? (
              <div
                key={`discount-feedback-${discountAnimationKey}`}
                className={`mt-4 flex items-start gap-2 rounded-2xl border px-3 py-3 text-[12px] shadow-sm animate-feedback-in ${
                  discountFeedback.type === "success"
                    ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]"
                    : "border-[#fecaca] bg-[#fef2f2] text-[#dc2626]"
                }`}
              >
                {discountFeedback.type === "success" ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <p>{discountFeedback.text}</p>
              </div>
            ) : null}
          </div>

          <div className="mt-5 space-y-3 text-[13px] text-[#4b5563]">
            <div className="flex items-center justify-between"><span>Subtotal</span><span className="font-medium text-black">{formatPrice(subtotal)}</span></div>
            <div className="flex items-center justify-between"><span>Shipping</span><span className="font-medium text-black">{formatPrice(shipping)}</span></div>
            <div className="flex items-center justify-between"><span>Tax</span><span className="font-medium text-black">{formatPrice(tax)}</span></div>
            {appliedPromoCode ? (
              <div className="flex items-center justify-between text-[#15803d]"><span>Promo ({appliedPromoCode})</span><span className="font-medium">-{formatPrice(discountAmount)}</span></div>
            ) : null}
            <div className="flex items-center justify-between border-t border-[#e4e8ef] pt-4 text-[20px] font-semibold text-black"><span>Order Total</span><span>{formatPrice(finalOrderTotal)}</span></div>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            className={`mt-5 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-[#0156ff] px-6 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0d63ff] hover:shadow-[0_12px_30px_rgba(1,86,255,0.28)] active:scale-[0.98] ${checkoutButtonPulse ? "animate-button-bounce" : ""}`}
          >
            Proceed to Checkout
          </button>
          <button className="mt-3 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-[#ffb800] px-6 text-[14px] font-semibold text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ffca2c] active:scale-[0.98]">
            Check out with PayPal
          </button>
          <button className="mt-3 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full border border-[#d9dde5] bg-white px-6 text-[14px] font-semibold text-black transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0156ff] hover:text-[#0156ff] active:scale-[0.98]">
            Check Out with Multiple Addresses
          </button>
        </div>
      </div>
    </section>
  );
}