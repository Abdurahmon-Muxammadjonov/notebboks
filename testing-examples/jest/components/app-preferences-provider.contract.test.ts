import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("app-preferences-provider.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("app-preferences-provider.tsx", "AppPreferencesProvider");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("app-preferences-provider.tsx", ["ts-notebook-shop-language", "ts-notebook-shop-theme"]);
  });
});
