import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("instagram-feed.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("instagram-feed.tsx", "InstagramFeed");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("instagram-feed.tsx", ["instagram.title", "blog"]);
  });
});
