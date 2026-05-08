import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("hero.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("hero.tsx", "Hero");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("hero.tsx", ["hero", "bg-[#070707]"]);
  });
});
