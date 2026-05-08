import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("add-to-cart-button.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("add-to-cart-button.tsx", "AddToCartButton");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("add-to-cart-button.tsx", ["common.cart", "min-w-10 text-center text-[15px] font-semibold"]);
  });
});
