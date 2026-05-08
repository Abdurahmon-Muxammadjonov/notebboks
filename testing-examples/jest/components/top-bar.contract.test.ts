import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("top-bar.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("top-bar.tsx", "TopBar");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("top-bar.tsx", ["topBar.days", "(00) 1234 5678"]);
  });
});
