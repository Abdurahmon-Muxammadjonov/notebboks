export type CartLine = {
  sku: string;
  quantity: number;
  unitPrice: number;
};

export type DiscountGateway = {
  getDiscountRate: (couponCode: string) => Promise<number>;
};

function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export async function calculateCheckoutTotal(
  lines: CartLine[],
  gateway: DiscountGateway,
  couponCode?: string,
): Promise<number> {
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);

  if (!couponCode) {
    return roundCurrency(subtotal);
  }

  const rate = await gateway.getDiscountRate(couponCode);
  const safeRate = Math.min(Math.max(rate, 0), 1);
  const discounted = subtotal * (1 - safeRate);

  return roundCurrency(discounted);
}
