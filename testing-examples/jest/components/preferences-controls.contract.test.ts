import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("preferences-controls.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("preferences-controls.tsx", "PreferencesControls");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("preferences-controls.tsx", ["common.language", "common.theme"]);
  });
});
