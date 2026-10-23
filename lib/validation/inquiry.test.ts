import { describe, expect, it } from "vitest";
import { inquirySchema } from "@/lib/validation/inquiry";

describe("inquirySchema", () => {
  it("normalizes valid enquiry details", () => {
    const result = inquirySchema.parse({
      name: "  Taylor Visitor  ",
      email: "TAYLOR@example.com",
      purpose: "general",
      message: "I would like to learn more about ECK.",
    });

    expect(result).toEqual({
      name: "Taylor Visitor",
      email: "taylor@example.com",
      purpose: "general",
      message: "I would like to learn more about ECK.",
    });
  });

  it("rejects invalid purposes and short messages", () => {
    const result = inquirySchema.safeParse({
      name: "Taylor Visitor",
      email: "taylor@example.com",
      purpose: "membership-benefits",
      message: "Hi",
    });

    expect(result.success).toBe(false);
  });
});