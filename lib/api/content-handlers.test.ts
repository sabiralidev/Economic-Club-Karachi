import { describe, expect, it } from "vitest";
import { publicFilter } from "@/lib/api/content-handlers";
import { ApiError, readJson } from "@/lib/api/http";

describe("public content filters", () => {
  it("always excludes unpublished content and supports safe article search", () => {
    expect(publicFilter("articles", new URLSearchParams("q=city+dialogue"))).toEqual({
      published: true,
      archived: { $ne: true },
      $text: { $search: "city dialogue" },
    });

  });

  it("filters upcoming events without exposing cancelled events", () => {
    const filter = publicFilter("events", new URLSearchParams("status=upcoming&from=2026-10-25&to=2026-10-31"));
    expect(filter.published).toBe(true);
    expect(filter.status).toBe("upcoming");
    expect(filter.startDate).toEqual({
      $gte: new Date("2026-10-25"),
      $lte: new Date("2026-10-31"),
    });
  });

  it("rejects malformed event date filters", () => {
    expect(() => publicFilter("events", new URLSearchParams("from=not-a-date"))).toThrow(ApiError);
  });
});

describe("JSON request parsing", () => {
  it("parses small JSON requests and caps streaming request bodies", async () => {
    await expect(readJson(new Request("http://localhost/api/test", {
      method: "POST",
      body: JSON.stringify({ name: "Test" }),
    }))).resolves.toEqual({ name: "Test" });

    await expect(readJson(new Request("http://localhost/api/test", {
      method: "POST",
      body: JSON.stringify({ value: "x".repeat(70_000) }),
    }))).rejects.toMatchObject({ status: 413 });
  });
});
