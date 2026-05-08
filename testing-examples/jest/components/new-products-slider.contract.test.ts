import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("new-products-slider.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("new-products-slider.tsx", "NewProductsSlider");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("new-products-slider.tsx", ["in_stock", "currency"]);
  });
});
