import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("category-section-client.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("category-section-client.tsx", "CategorySectionClient");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("category-section-client.tsx", ["PC Corpuses", "currency"]);
  });
});
