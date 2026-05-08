import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("cart-page-content.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("cart-page-content.tsx", "CartPageContent");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("cart-page-content.tsx", ["Country tanlang.", "success"]);
  });
});
