import { describe, expect, it, vi } from "vitest";

import { calculateCheckoutTotal, type CartLine, type DiscountGateway } from "../src/checkout-total";

describe("calculateCheckoutTotal", () => {
  it("returns subtotal quickly when no coupon is passed (FAST + ISOLATION)", async () => {
    // Arrange
    const lines: CartLine[] = [
      { sku: "NOTEBOOK-01", quantity: 1, unitPrice: 1200 },
      { sku: "MOUSE-01", quantity: 2, unitPrice: 25 },
    ];
    const gateway: DiscountGateway = {
      getDiscountRate: vi.fn().mockResolvedValue(0.5),
    };

    // Act
    const result = await calculateCheckoutTotal(lines, gateway);

    // Assert
    expect(result).toBe(1250);
    expect(gateway.getDiscountRate).not.toHaveBeenCalled();
  });

  it("applies discount from mocked gateway (AAA + MOCK + SELF-VALIDATING)", async () => {
    // Arrange
    const lines: CartLine[] = [{ sku: "MONITOR-27", quantity: 2, unitPrice: 199.99 }];
    const gateway: DiscountGateway = {
      getDiscountRate: vi.fn().mockResolvedValue(0.1),
    };

    // Act
    const result = await calculateCheckoutTotal(lines, gateway, "SPRING10");

    // Assert
    expect(result).toBe(359.98);
    expect(gateway.getDiscountRate).toHaveBeenCalledTimes(1);
    expect(gateway.getDiscountRate).toHaveBeenCalledWith("SPRING10");
  });

  it("clamps invalid discount values for reproducible behavior (R + T)", async () => {
    // Arrange
    const lines: CartLine[] = [{ sku: "KEYBOARD", quantity: 1, unitPrice: 100 }];
    const gateway: DiscountGateway = {
      getDiscountRate: vi.fn().mockResolvedValue(10),
    };

    // Act
    const result = await calculateCheckoutTotal(lines, gateway, "BROKEN");

    // Assert
    expect(result).toBe(0);
  });
});
