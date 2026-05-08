import fs from "node:fs";
import path from "node:path";

import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import RootLayout, { metadata } from "@/app/layout";

jest.mock("@/components/app-preferences-provider", () => ({
  AppPreferencesProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock("@/components/hash-scroll-handler", () => ({
  HashScrollHandler: () => null,
}));

describe("RootLayout strict content contract", () => {
  it("locks metadata.title exact text to prevent accidental changes", () => {
    expect(metadata.title).toBe("TS Notebook Shop");
  });

  it("locks metadata.applicationName exact text", () => {
    expect(metadata.applicationName).toBe("TS Notebook Shop");
  });

  it("locks metadata.description exact text", () => {
    expect(metadata.description).toBe(
      "Responsive tech storefront with multilingual support, dark mode, cart, checkout, and promotional offers.",
    );
  });

  it("locks metadata keywords exact ordered array", () => {
    expect(metadata.keywords).toEqual([
      "Next.js store",
      "tech shop",
      "notebooks",
      "checkout",
      "dark mode",
      "responsive ecommerce",
    ]);
  });

  it("renders exact visible skip-link text and exact href", () => {
    render(
      <RootLayout>
        <span>STRICT_CHILD</span>
      </RootLayout>,
    );

    const link = screen.getByText("Skip to content");

    expect(link.textContent).toBe("Skip to content");
    expect(link.getAttribute("href")).toBe("#page-content");
  });

  it("renders exact page-content id and exact child text", () => {
    const { container } = render(
      <RootLayout>
        <span>STRICT_CHILD</span>
      </RootLayout>,
    );

    const pageContent = container.querySelector("#page-content");

    expect(pageContent?.id).toBe("page-content");
    expect(pageContent?.textContent).toBe("STRICT_CHILD");
  });
});

describe("layout source-code regression guard", () => {
  const layoutFilePath = path.join(process.cwd(), "app", "layout.tsx");
  const source = fs.readFileSync(layoutFilePath, "utf8");

  it("locks exact TS Notebook Shop literal in source", () => {
    expect(source.includes('title: "TS Notebook Shop"')).toBe(true);
    expect(source.includes('applicationName: "TS Notebook Shop"')).toBe(true);
  });

  it("locks exact Skip to content literal in source", () => {
    expect(source.includes("Skip to content")).toBe(true);
  });
});
