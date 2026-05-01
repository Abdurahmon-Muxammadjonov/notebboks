const CART_STORAGE_KEY = "ts-notebook-shop-cart-items";
const CART_UPDATED_EVENT = "ts-notebook-shop-cart-updated";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  category?: string | null;
  quantity: number;
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getCartCount() {
  return getCartItems().reduce((total, item) => total + item.quantity, 0);
}

export function getCartItems(): CartItem[] {
  if (!isBrowser()) {
    return [];
  }

  const storedValue = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue) as CartItem[];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((item) => item && typeof item.id === "string" && Number.isFinite(item.quantity) && item.quantity > 0);
  } catch {
    return [];
  }
}

export function setCartItems(items: CartItem[]) {
  if (!isBrowser()) {
    return [];
  }

  const normalizedItems = items
    .map((item) => ({ ...item, quantity: Math.max(0, Math.floor(item.quantity)) }))
    .filter((item) => item.quantity > 0);

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalizedItems));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: normalizedItems }));
  return normalizedItems;
}

export function clearCart() {
  return setCartItems([]);
}

export function addCartItem(item: Omit<CartItem, "quantity">, amount = 1) {
  const currentItems = getCartItems();
  const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    return updateCartItemQuantity(item.id, existingItem.quantity + amount);
  }

  return setCartItems([...currentItems, { ...item, quantity: Math.max(1, Math.floor(amount)) }]);
}

export function updateCartItemQuantity(id: string, quantity: number) {
  const currentItems = getCartItems();
  return setCartItems(
    currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
  );
}

export function incrementCartItem(id: string, amount = 1) {
  const currentItem = getCartItems().find((item) => item.id === id);
  if (!currentItem) {
    return getCartItems();
  }

  return updateCartItemQuantity(id, currentItem.quantity + amount);
}

export function decrementCartItem(id: string, amount = 1, minQuantity = 0) {
  const currentItem = getCartItems().find((item) => item.id === id);
  if (!currentItem) {
    return getCartItems();
  }

  return updateCartItemQuantity(id, Math.max(minQuantity, currentItem.quantity - amount));
}

export function removeCartItem(id: string) {
  return setCartItems(getCartItems().filter((item) => item.id !== id));
}

export function subscribeToCart(listener: (items: CartItem[]) => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const handleCartUpdated = (event: Event) => {
    const customEvent = event as CustomEvent<CartItem[]>;
    listener(Array.isArray(customEvent.detail) ? customEvent.detail : getCartItems());
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY) {
      listener(getCartItems());
    }
  };

  window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated as EventListener);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated as EventListener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function subscribeToCartCount(listener: (count: number) => void) {
  return subscribeToCart((items) => {
    listener(items.reduce((total, item) => total + item.quantity, 0));
  });
}