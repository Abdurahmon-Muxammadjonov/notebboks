import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("product.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("product.tsx", "Product");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("product.tsx", ["notebooks", "pc-corpuses"]);
  });
});
