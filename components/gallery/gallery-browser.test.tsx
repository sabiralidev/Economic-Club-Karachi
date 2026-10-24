import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { GalleryBrowser } from "@/components/gallery/gallery-browser";

const items = [
  { id: "gallery-one", slug: "image-one", title: "First approved image", description: "", category: "events", images: [{ src: "/one.jpg", alt: "First image description" }], createdAt: "", updatedAt: "" },
  { id: "gallery-two", slug: "image-two", title: "Second approved image", description: "", category: "community", images: [{ src: "/two.jpg", alt: "Second image description" }], createdAt: "", updatedAt: "" },
];

describe("GalleryBrowser", () => {
  beforeEach(() => {
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.setAttribute("open", "");
      },
    });
  });

  it("opens an image and navigates between approved items", () => {
    render(<GalleryBrowser items={items} />);

    fireEvent.click(screen.getByRole("button", { name: "Open image: First image description" }));
    const dialog = screen.getByRole("dialog", { name: "Gallery image viewer" });
    expect(dialog).toHaveAttribute("open");
    expect(within(dialog).getByRole("img", { name: "First image description" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next image" }));
    expect(within(dialog).getByRole("img", { name: "Second image description" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Previous image" }));
    expect(within(dialog).getByRole("img", { name: "First image description" })).toBeInTheDocument();
  });
});