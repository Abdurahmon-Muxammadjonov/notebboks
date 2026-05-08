import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("checkout-page-content.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("checkout-page-content.tsx", "CheckoutPageContent");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("checkout-page-content.tsx", ["Please enter a valid email address.", "success"]);
  });
});
