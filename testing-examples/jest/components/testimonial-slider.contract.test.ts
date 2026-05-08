import { expectExportFunction, expectSourceLiterals } from "./helpers/source-contract";

describe("testimonial-slider.tsx contract", () => {
  it("locks exported component name", () => {
    expectExportFunction("testimonial-slider.tsx", "TestimonialSlider");
  });

  it("locks critical source literals", () => {
    expectSourceLiterals("testimonial-slider.tsx", ["Tama Brown", "Daniel Carter"]);
  });
});
