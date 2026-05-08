import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("home-bottom-sections.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("home-bottom-sections.tsx", "HomeBottomSections");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("home-bottom-sections.tsx", ["Information", "About Us"]);
  });
});
