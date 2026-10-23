import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandMark } from "@/components/brand-mark";

describe("BrandMark", () => {
  it("renders as a decorative image", () => {
    const { container } = render(<BrandMark />);
    expect(container.querySelector("img")).toHaveAttribute("src", "/eck-mark.svg");
    expect(container.querySelector("img")).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
