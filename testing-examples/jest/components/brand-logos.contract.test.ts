import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("brand-logos.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("brand-logos.tsx", "BrandLogos");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("brand-logos.tsx", ["ROCCAT", "GIGABYTE"]);
  });
});
