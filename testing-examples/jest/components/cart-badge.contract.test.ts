import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("cart-badge.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("cart-badge.tsx", "CartBadge");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("cart-badge.tsx", ["/cart", "relative"]);
  });
});
