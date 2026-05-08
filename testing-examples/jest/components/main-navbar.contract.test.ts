import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("main-navbar.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("main-navbar.tsx", "MainNavbar");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("main-navbar.tsx", ["nav.laptops", "pc-corpuses"]);
  });
});
