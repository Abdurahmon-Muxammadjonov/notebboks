import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("hash-scroll-handler.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("hash-scroll-handler.tsx", "HashScrollHandler");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("hash-scroll-handler.tsx", ["ts-notebook-shop-pending-hash", "window.sessionStorage"]);
  });
});
