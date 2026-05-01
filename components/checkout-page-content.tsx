"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, CreditCard, ShieldCheck, ShoppingBag, X } from "lucide-react";
import * as yup from "yup";

import { CartItem, getCartItems, subscribeToCart } from "@/lib/cart";
import { getAppliedPromoCode, isValidPromoCode, PROMO_CODE, PROMO_DISCOUNT_RATE, setAppliedPromoCode, subscribeToPromoCode } from "@/lib/promo";

type CheckoutFormValues = {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  streetAddress: string;
  apartment: string;
  city: string;
  stateProvince: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
};

type CheckoutField = keyof CheckoutFormValues;
type CheckoutErrors = Partial<Record<CheckoutField, string>>;
type CheckoutFeedback = { type: "success" | "error"; text: string } | null;

const checkoutSchema = yup.object({
  email: yup.string().trim().email("Please enter a valid email address.").required("Email address is required."),
  firstName: yup.string().trim().min(2, "First name must be at least 2 characters.").required("First name is required."),
  lastName: yup.string().trim().min(2, "Last name must be at least 2 characters.").required("Last name is required."),
  company: yup.string().trim(),
  streetAddress: yup.string().trim().min(6, "Street address must be at least 6 characters.").required("Street address is required."),
  apartment: yup.string().trim(),
  city: yup.string().trim().min(2, "City must be at least 2 characters.").required("City is required."),
  stateProvince: yup.string().trim().min(2, "State / Province must be at least 2 characters.").required("State / Province is required."),
  zipCode: yup
    .string()
    .trim()
    .matches(/^[A-Za-z0-9\-\s]{4,10}$/, "Please enter a valid ZIP / Postal Code.")
    .required("ZIP / Postal Code is required."),
  country: yup.string().trim().required("Country is required."),
  phoneNumber: yup
    .string()
    .trim()
    .matches(/^\+?[0-9\s\-()]{7,20}$/, "Please enter a valid phone number.")
    .required("Phone number is required."),
});

const fieldClassName =
  "h-12 w-full rounded-2xl border bg-white px-4 text-[14px] text-black outline-none transition-all duration-300 placeholder:text-[#9ca3af]";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

function mapCheckoutErrors(error: yup.ValidationError) {
  const nextErrors: CheckoutErrors = {};

  for (const issue of error.inner) {
    if (!issue.path || nextErrors[issue.path as CheckoutField]) {
      continue;
    }

    nextErrors[issue.path as CheckoutField] = issue.message;
  }

  if (error.path && !nextErrors[error.path as CheckoutField]) {
    nextErrors[error.path as CheckoutField] = error.message;
  }

  return nextErrors;
}

const initialFormValues: CheckoutFormValues = {
  email: "",
  firstName: "",
  lastName: "",
  company: "",
  streetAddress: "",
  apartment: "",
  city: "",
  stateProvince: "",
  zipCode: "",
  country: "United States",
  phoneNumber: "",
};

export function CheckoutPageContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [discountFeedback, setDiscountFeedback] = useState<CheckoutFeedback>(null);
  const [discountFeedbackKey, setDiscountFeedbackKey] = useState(0);
  const [discountButtonPulse, setDiscountButtonPulse] = useState(false);
  const [appliedPromoCode, setAppliedPromoCodeState] = useState("");
  const [formValues, setFormValues] = useState<CheckoutFormValues>(initialFormValues);
  const [formErrors, setFormErrors] = useState<CheckoutErrors>({});
  const [feedback, setFeedback] = useState<CheckoutFeedback>(null);
  const [feedbackKey, setFeedbackKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitPulse, setSubmitPulse] = useState(false);

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
    if (!submitPulse) {
      return;
    }

    const timer = window.setTimeout(() => setSubmitPulse(false), 550);
    return () => window.clearTimeout(timer);
  }, [submitPulse]);

  useEffect(() => {
    if (!discountButtonPulse) {
      return;
    }

    const timer = window.setTimeout(() => setDiscountButtonPulse(false), 550);
    return () => window.clearTimeout(timer);
  }, [discountButtonPulse]);

  const cartCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);
  const subtotal = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);
  const shipping = cartCount > 0 ? 21 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;
  const discountAmount = appliedPromoCode ? total * PROMO_DISCOUNT_RATE : 0;
  const finalTotal = Math.max(0, total - discountAmount);

  const handleInputChange = (field: CheckoutField, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
    setFeedback(null);
  };

  const applyPromoCode = async (code: string) => {
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      const message = "Discount code kiriting.";
      setDiscountError(message);
      setDiscountFeedback({ type: "error", text: message });
      setDiscountFeedbackKey((current) => current + 1);
      setDiscountButtonPulse(true);
      return;
    }

    if (!isValidPromoCode(normalizedCode)) {
      const message = `Promo code is not valid. Try ${PROMO_CODE}.`;
      setDiscountError(message);
      setDiscountFeedback({ type: "error", text: message });
      setDiscountFeedbackKey((current) => current + 1);
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
    setDiscountFeedbackKey((current) => current + 1);
    setDiscountButtonPulse(true);
  };

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      setFeedback({
        type: "error",
        text: "Your cart is empty. Please add products before placing an order.",
      });
      setFeedbackKey((current) => current + 1);
      setSubmitPulse(true);
      return;
    }

    try {
      await checkoutSchema.validate(formValues, { abortEarly: false });
      setFormErrors({});
      setFeedback({
        type: "success",
        text: "Everything looks good. Your order is ready to be submitted.",
      });
      setFeedbackKey((current) => current + 1);
      setSubmitPulse(true);
      setIsModalOpen(true);
    } catch (error) {
      if (!(error instanceof yup.ValidationError)) {
        return;
      }

      setFormErrors(mapCheckoutErrors(error));
      setFeedback({
        type: "error",
        text: "Please complete the required fields before placing your order.",
      });
      setFeedbackKey((current) => current + 1);
      setSubmitPulse(true);
    }
  };

  return (
    <>
      <section className="mx-auto max-w-360 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-4 flex items-center gap-2 text-[11px] text-[#8b95a7]">
          <Link href="/" className="hover:text-[#0156ff]">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-[#0156ff]">Cart</Link>
          <span>/</span>
          <span className="text-[#b3bac6]">Checkout</span>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-black sm:text-[34px]">Checkout</h1>
            <p className="mt-2 text-[15px] text-[#7b8394]">Complete your shipping details and review your order before placing it.</p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-[#dbe7ff] bg-[#f7faff] px-4 py-2 text-[12px] font-medium text-[#0156ff]">
            <ShieldCheck className="h-4 w-4" />
            Secure checkout experience
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.7fr]">
          <div className="rounded-[28px] border border-[#e7eef6] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-3 border-b border-[#edf2f7] pb-5">
              <div>
                <h2 className="text-[26px] font-semibold text-black">Shipping Address</h2>
                <p className="mt-1 text-[14px] text-[#7b8394]">Use your active contact details so we can reach you quickly.</p>
              </div>
              <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#0156ff] md:flex">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-[13px] font-semibold text-black">Email Address *</label>
                <input
                  value={formValues.email}
                  onChange={(event) => handleInputChange("email", event.target.value)}
                  placeholder="you@example.com"
                  className={`${fieldClassName} ${formErrors.email ? "animate-field-error border-[#ef4444] ring-4 ring-[#fee2e2]" : "border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]"}`}
                />
                {formErrors.email ? <p className="mt-1.5 text-[12px] text-[#dc2626]">{formErrors.email}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-black">First Name *</label>
                <input
                  value={formValues.firstName}
                  onChange={(event) => handleInputChange("firstName", event.target.value)}
                  placeholder="John"
                  className={`${fieldClassName} ${formErrors.firstName ? "animate-field-error border-[#ef4444] ring-4 ring-[#fee2e2]" : "border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]"}`}
                />
                {formErrors.firstName ? <p className="mt-1.5 text-[12px] text-[#dc2626]">{formErrors.firstName}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-black">Last Name *</label>
                <input
                  value={formValues.lastName}
                  onChange={(event) => handleInputChange("lastName", event.target.value)}
                  placeholder="Doe"
                  className={`${fieldClassName} ${formErrors.lastName ? "animate-field-error border-[#ef4444] ring-4 ring-[#fee2e2]" : "border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]"}`}
                />
                {formErrors.lastName ? <p className="mt-1.5 text-[12px] text-[#dc2626]">{formErrors.lastName}</p> : null}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-[13px] font-semibold text-black">Company</label>
                <input
                  value={formValues.company}
                  onChange={(event) => handleInputChange("company", event.target.value)}
                  placeholder="Optional"
                  className={`${fieldClassName} border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-[13px] font-semibold text-black">Street Address *</label>
                <input
                  value={formValues.streetAddress}
                  onChange={(event) => handleInputChange("streetAddress", event.target.value)}
                  placeholder="123 Main Street"
                  className={`${fieldClassName} ${formErrors.streetAddress ? "animate-field-error border-[#ef4444] ring-4 ring-[#fee2e2]" : "border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]"}`}
                />
                {formErrors.streetAddress ? <p className="mt-1.5 text-[12px] text-[#dc2626]">{formErrors.streetAddress}</p> : null}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-[13px] font-semibold text-black">Apartment / Suite</label>
                <input
                  value={formValues.apartment}
                  onChange={(event) => handleInputChange("apartment", event.target.value)}
                  placeholder="Optional"
                  className={`${fieldClassName} border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]`}
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-black">City *</label>
                <input
                  value={formValues.city}
                  onChange={(event) => handleInputChange("city", event.target.value)}
                  placeholder="New York"
                  className={`${fieldClassName} ${formErrors.city ? "animate-field-error border-[#ef4444] ring-4 ring-[#fee2e2]" : "border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]"}`}
                />
                {formErrors.city ? <p className="mt-1.5 text-[12px] text-[#dc2626]">{formErrors.city}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-black">State / Province *</label>
                <input
                  value={formValues.stateProvince}
                  onChange={(event) => handleInputChange("stateProvince", event.target.value)}
                  placeholder="California"
                  className={`${fieldClassName} ${formErrors.stateProvince ? "animate-field-error border-[#ef4444] ring-4 ring-[#fee2e2]" : "border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]"}`}
                />
                {formErrors.stateProvince ? <p className="mt-1.5 text-[12px] text-[#dc2626]">{formErrors.stateProvince}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-black">ZIP / Postal Code *</label>
                <input
                  value={formValues.zipCode}
                  onChange={(event) => handleInputChange("zipCode", event.target.value)}
                  placeholder="10001"
                  className={`${fieldClassName} ${formErrors.zipCode ? "animate-field-error border-[#ef4444] ring-4 ring-[#fee2e2]" : "border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]"}`}
                />
                {formErrors.zipCode ? <p className="mt-1.5 text-[12px] text-[#dc2626]">{formErrors.zipCode}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-black">Country *</label>
                <select
                  value={formValues.country}
                  onChange={(event) => handleInputChange("country", event.target.value)}
                  className={`${fieldClassName} ${formErrors.country ? "animate-field-error border-[#ef4444] ring-4 ring-[#fee2e2]" : "border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]"}`}
                >
                  <option>United States</option>
                  <option>Australia</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Uzbekistan</option>
                </select>
                {formErrors.country ? <p className="mt-1.5 text-[12px] text-[#dc2626]">{formErrors.country}</p> : null}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-[13px] font-semibold text-black">Phone Number *</label>
                <input
                  value={formValues.phoneNumber}
                  onChange={(event) => handleInputChange("phoneNumber", event.target.value)}
                  placeholder="+1 (555) 000-1234"
                  className={`${fieldClassName} ${formErrors.phoneNumber ? "animate-field-error border-[#ef4444] ring-4 ring-[#fee2e2]" : "border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]"}`}
                />
                {formErrors.phoneNumber ? <p className="mt-1.5 text-[12px] text-[#dc2626]">{formErrors.phoneNumber}</p> : null}
              </div>
            </div>

            {feedback ? (
              <div
                key={`checkout-feedback-${feedbackKey}`}
                className={`mt-6 flex items-start gap-3 rounded-3xl border px-4 py-4 text-[13px] shadow-sm animate-feedback-in ${
                  feedback.type === "success"
                    ? "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]"
                    : "border-[#fecaca] bg-[#fef2f2] text-[#dc2626]"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                ) : (
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                )}
                <p>{feedback.text}</p>
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSubmitOrder}
                className={`inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-[#0156ff] px-8 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0d63ff] hover:shadow-[0_12px_30px_rgba(1,86,255,0.28)] active:scale-[0.98] ${submitPulse ? "animate-button-bounce" : ""}`}
              >
                Place Order
              </button>
              <Link href="/cart" className="inline-flex h-12 items-center justify-center rounded-full border border-[#d9dde5] bg-white px-8 text-[14px] font-semibold text-black transition-all duration-300 hover:border-[#0156ff] hover:text-[#0156ff]">
                Back to Cart
              </Link>
            </div>
          </div>

          <aside className="h-fit rounded-[28px] border border-[#e7eef6] bg-[#f7faff] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#dbe7ff] pb-4">
              <div>
                <h2 className="text-[28px] font-semibold text-black">Order Summary</h2>
                <p className="mt-1 text-[13px] text-[#6b7280]">{cartCount} item(s) selected</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0156ff] shadow-[0_10px_25px_rgba(1,86,255,0.12)]">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-3">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-2xl bg-white p-3 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
                    <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl bg-[#f8fafc] p-2">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="max-h-full w-auto object-contain" />
                      ) : (
                        <div className="text-xs text-slate-400">No image</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b95a7]">{item.category ?? "Products"}</p>
                      <h3 className="mt-1 line-clamp-2 text-[13px] font-semibold leading-normal text-black">{item.name}</h3>
                      <div className="mt-2 flex items-center justify-between gap-3 text-[12px] text-[#6b7280]">
                        <span>Qty: {item.quantity}</span>
                        <span className="font-semibold text-black">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-[#cbd5e1] bg-white px-5 py-10 text-center">
                  <p className="text-[18px] font-semibold text-black">Your cart is empty</p>
                  <p className="mt-2 text-[13px] text-[#6b7280]">Add products to see your order summary here.</p>
                </div>
              )}
            </div>

            <div className="mt-5 rounded-3xl bg-white p-5 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
              <div className="mb-3 flex items-center justify-between text-[13px] font-medium text-black">
                <span>Apply Discount Code</span>
                <span>-</span>
              </div>
              <input
                value={discountCode}
                onChange={(event) => {
                  setDiscountCode(event.target.value);
                  setDiscountError(null);
                  setDiscountFeedback(null);
                }}
                placeholder="Enter discount code"
                className={`${fieldClassName} ${discountError ? "animate-field-error border-[#ef4444] ring-4 ring-[#fee2e2]" : "border-[#d9dde5] hover:border-[#9eb6ff] focus:border-[#0156ff] focus:ring-4 focus:ring-[#dbe7ff]"}`}
              />
              {discountError ? <p className="mt-1.5 text-[12px] text-[#dc2626]">{discountError}</p> : null}
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
                onClick={() => applyPromoCode(discountCode)}
                className={`mt-4 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full border-2 border-[#0156ff] bg-white px-6 text-[14px] font-semibold text-[#0156ff] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0156ff] hover:text-white hover:shadow-[0_12px_28px_rgba(1,86,255,0.2)] active:scale-[0.98] ${discountButtonPulse ? "animate-button-bounce" : ""}`}
              >
                Apply Discount
              </button>

              {discountFeedback ? (
                <div
                  key={`checkout-discount-feedback-${discountFeedbackKey}`}
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

            <div className="mt-5 space-y-3 rounded-3xl bg-white p-5 shadow-[0_10px_25px_rgba(15,23,42,0.06)] text-[14px] text-[#4b5563]">
              <div className="flex items-center justify-between"><span>Subtotal</span><span className="font-semibold text-black">{formatPrice(subtotal)}</span></div>
              <div className="flex items-center justify-between"><span>Shipping</span><span className="font-semibold text-black">{formatPrice(shipping)}</span></div>
              <div className="flex items-center justify-between"><span>Tax</span><span className="font-semibold text-black">{formatPrice(tax)}</span></div>
              {appliedPromoCode ? (
                <div className="flex items-center justify-between text-[#15803d]"><span>Promo ({appliedPromoCode})</span><span className="font-semibold">-{formatPrice(discountAmount)}</span></div>
              ) : null}
              <div className="flex items-center justify-between border-t border-[#e5e7eb] pt-4 text-[20px] font-semibold text-black"><span>Total</span><span>{formatPrice(finalTotal)}</span></div>
            </div>
          </aside>
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/65 px-4 backdrop-blur-sm animate-overlay-in">
          <div className="relative w-full max-w-lg rounded-4xl bg-white p-7 shadow-[0_30px_80px_rgba(15,23,42,0.28)] animate-modal-in md:p-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#f8fafc] text-[#64748b] transition-all duration-300 hover:bg-[#e2e8f0] hover:text-black active:scale-95"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-[#0156ff] to-[#35a4ff] text-white shadow-[0_18px_40px_rgba(1,86,255,0.3)]">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="mt-6 text-[30px] font-semibold tracking-[-0.03em] text-black">Order confirmed</h3>
            <p className="mt-3 text-[16px] leading-7 text-[#475569]">
              Your order has been accepted. We will contact you soon.
            </p>
            <p className="mt-2 text-[14px] leading-6 text-[#64748b]">
              Thank you for shopping with us. Our team will review your details and reach out shortly with the next steps.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-[#0156ff] px-7 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0d63ff] hover:shadow-[0_12px_30px_rgba(1,86,255,0.28)] active:scale-[0.98]"
              >
                Continue
              </button>
              <Link href="/products" className="inline-flex h-12 items-center justify-center rounded-full border border-[#d9dde5] bg-white px-7 text-[14px] font-semibold text-black transition-all duration-300 hover:border-[#0156ff] hover:text-[#0156ff]">
                Keep Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}