const PROMO_STORAGE_KEY = "ts-notebook-shop-promo-code";
const PROMO_UPDATED_EVENT = "ts-notebook-shop-promo-updated";

export const PROMO_CODE = "GOSHOP";
export const PROMO_DISCOUNT_RATE = 0.5;

function isBrowser() {
  return typeof window !== "undefined";
}

export function normalizePromoCode(code: string) {
  return code.trim().toUpperCase();
}

export function isValidPromoCode(code: string) {
  return normalizePromoCode(code) === PROMO_CODE;
}

export function getAppliedPromoCode() {
  if (!isBrowser()) {
    return "";
  }

  return normalizePromoCode(window.localStorage.getItem(PROMO_STORAGE_KEY) ?? "");
}

export function setAppliedPromoCode(code: string) {
  if (!isBrowser()) {
    return "";
  }

  const normalizedCode = normalizePromoCode(code);

  if (!normalizedCode) {
    window.localStorage.removeItem(PROMO_STORAGE_KEY);
  } else {
    window.localStorage.setItem(PROMO_STORAGE_KEY, normalizedCode);
  }

  window.dispatchEvent(new CustomEvent(PROMO_UPDATED_EVENT, { detail: normalizedCode }));
  return normalizedCode;
}

export function clearAppliedPromoCode() {
  return setAppliedPromoCode("");
}

export function subscribeToPromoCode(listener: (code: string) => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const handlePromoUpdated = (event: Event) => {
    const customEvent = event as CustomEvent<string>;
    listener(typeof customEvent.detail === "string" ? normalizePromoCode(customEvent.detail) : getAppliedPromoCode());
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === PROMO_STORAGE_KEY) {
      listener(getAppliedPromoCode());
    }
  };

  window.addEventListener(PROMO_UPDATED_EVENT, handlePromoUpdated as EventListener);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(PROMO_UPDATED_EVENT, handlePromoUpdated as EventListener);
    window.removeEventListener("storage", handleStorage);
  };
}