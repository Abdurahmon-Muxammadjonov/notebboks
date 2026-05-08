import { calculateCheckoutTotal, type CartLine, type DiscountGateway } from "../../src/checkout-total";

describe("calculateCheckoutTotal strict contract", () => {
  describe("normal behavior", () => {
    it("returns exact subtotal when coupon is omitted", async () => {
      const lines: CartLine[] = [
        { sku: "NOTEBOOK-01", quantity: 1, unitPrice: 1200 },
        { sku: "MOUSE-01", quantity: 2, unitPrice: 25 },
      ];
      const gateway: DiscountGateway = {
        getDiscountRate: jest.fn().mockResolvedValue(0.5),
      };

      const result = await calculateCheckoutTotal(lines, gateway);

      expect(result).toBe(1250);
      expect(gateway.getDiscountRate).toHaveBeenCalledTimes(0);
    });

    it("applies discount and rounds to 2 decimals", async () => {
      const lines: CartLine[] = [{ sku: "MONITOR-27", quantity: 2, unitPrice: 199.99 }];
      const gateway: DiscountGateway = {
        getDiscountRate: jest.fn().mockResolvedValue(0.1),
      };

      const result = await calculateCheckoutTotal(lines, gateway, "SPRING10");

      expect(result).toBe(359.98);
      expect(gateway.getDiscountRate).toHaveBeenCalledTimes(1);
      expect(gateway.getDiscountRate).toHaveBeenCalledWith("SPRING10");
    });

    it("treats empty coupon as no coupon and does not call gateway", async () => {
      const lines: CartLine[] = [{ sku: "TABLET", quantity: 1, unitPrice: 500 }];
      const gateway: DiscountGateway = {
        getDiscountRate: jest.fn().mockResolvedValue(0.9),
      };

      const result = await calculateCheckoutTotal(lines, gateway, "");

      expect(result).toBe(500);
      expect(gateway.getDiscountRate).toHaveBeenCalledTimes(0);
    });
  });

  describe("boundary and edge behavior", () => {
    it("returns 0 for empty cart", async () => {
      const gateway: DiscountGateway = {
        getDiscountRate: jest.fn().mockResolvedValue(0.2),
      };

      const result = await calculateCheckoutTotal([], gateway);

      expect(result).toBe(0);
      expect(gateway.getDiscountRate).toHaveBeenCalledTimes(0);
    });

    it("clamps discount rate above 1 to 1", async () => {
      const lines: CartLine[] = [{ sku: "KEYBOARD", quantity: 1, unitPrice: 100 }];
      const gateway: DiscountGateway = {
        getDiscountRate: jest.fn().mockResolvedValue(10),
      };

      const result = await calculateCheckoutTotal(lines, gateway, "BROKEN");

      expect(result).toBe(0);
    });

    it("clamps discount rate below 0 to 0", async () => {
      const lines: CartLine[] = [{ sku: "HEADSET", quantity: 1, unitPrice: 100 }];
      const gateway: DiscountGateway = {
        getDiscountRate: jest.fn().mockResolvedValue(-1),
      };

      const result = await calculateCheckoutTotal(lines, gateway, "NEGATIVE");

      expect(result).toBe(100);
    });
  });

  describe("invalid inputs and error handling", () => {
    it("throws exact TypeError when lines is null", async () => {
      const gateway: DiscountGateway = {
        getDiscountRate: jest.fn().mockResolvedValue(0.2),
      };

      await expect(
        calculateCheckoutTotal(null as unknown as CartLine[], gateway),
      ).rejects.toThrow("Cannot read properties of null (reading 'reduce')");
    });

    it("throws exact TypeError when lines is undefined", async () => {
      const gateway: DiscountGateway = {
        getDiscountRate: jest.fn().mockResolvedValue(0.2),
      };

      await expect(
        calculateCheckoutTotal(undefined as unknown as CartLine[], gateway),
      ).rejects.toThrow("Cannot read properties of undefined (reading 'reduce')");
    });

    it("propagates gateway failure exactly", async () => {
      const lines: CartLine[] = [{ sku: "GPU", quantity: 1, unitPrice: 1000 }];
      const gateway: DiscountGateway = {
        getDiscountRate: jest.fn().mockRejectedValue(new Error("gateway timeout")),
      };

      await expect(calculateCheckoutTotal(lines, gateway, "X")).rejects.toThrow("gateway timeout");
      expect(gateway.getDiscountRate).toHaveBeenCalledTimes(1);
      expect(gateway.getDiscountRate).toHaveBeenCalledWith("X");
    });

    it("keeps current coercion behavior for unexpected runtime types", async () => {
      const gateway: DiscountGateway = {
        getDiscountRate: jest.fn().mockResolvedValue(0),
      };

      const result = await calculateCheckoutTotal(
        [{ sku: "RUNTIME", quantity: "2" as unknown as number, unitPrice: 10 }],
        gateway,
      );

      expect(result).toBe(20);
    });
  });
});
