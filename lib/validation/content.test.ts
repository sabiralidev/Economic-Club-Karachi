import { describe, expect, it } from "vitest";
import { eventSchema, serviceSchema, siteSettingsSchema } from "@/lib/validation/content";
import { membershipApplicationSchema, publicInquirySchema } from "@/lib/validation/inquiry";

describe("content validation", () => {
  it("normalizes inquiry contact details and rejects undeclared fields", () => {
    expect(publicInquirySchema.parse({
      name: "  A. Visitor ",
      email: "VISITOR@example.com",
      phone: "  +92 300 1234567 ",
      purpose: "general",
      message: "Please share information about ECK.",
      consent: true,
    })).toMatchObject({ name: "A. Visitor", email: "visitor@example.com", phone: "+92 300 1234567" });

    expect(publicInquirySchema.safeParse({
      name: "A. Visitor",
      email: "visitor@example.com",
      purpose: "general",
      message: "Please share information about ECK.",
      isAdmin: true,
    }).success).toBe(false);
  });

  it("requires affirmative consent for participation applications", () => {
    const application = {
      name: "A. Visitor",
      email: "visitor@example.com",
      interest: "membership",
      message: "I would like to learn more about applying.",
      consent: true,
    };
    expect(membershipApplicationSchema.safeParse(application).success).toBe(true);
    expect(membershipApplicationSchema.safeParse({ ...application, consent: false }).success).toBe(false);
  });

  it("rejects event date ranges that end before they start", () => {
    const result = eventSchema.safeParse({
      title: "Community discussion",
      slug: "community-discussion",
      summary: "A discussion for community participants.",
      description: "Details will be confirmed with participants.",
      startDate: "2026-10-25T10:00:00.000Z",
      endDate: "2026-10-24T10:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("accepts safe service image paths and rejects executable image URLs", () => {
    const service = {
      title: "Community dialogue",
      slug: "community-dialogue",
      summary: "A proposed opportunity for conversation.",
      description: "Details are subject to confirmation.",
      category: "Dialogue",
    };
    expect(serviceSchema.safeParse({ ...service, image: "/images/dialogue.jpg" }).success).toBe(true);
    expect(serviceSchema.safeParse({ ...service, image: "javascript:alert(1)" }).success).toBe(false);
  });

  it("allows only HTTPS social links", () => {
    expect(siteSettingsSchema.safeParse({
      socialLinks: { linkedin: "https://www.linkedin.com/company/eck/" },
    }).success).toBe(true);
    expect(siteSettingsSchema.safeParse({
      socialLinks: { linkedin: "javascript:alert(1)" },
    }).success).toBe(false);
  });
});
