import { afterEach, describe, expect, it, vi } from "vitest";
import mongoose from "mongoose";
import { connectMongo } from "@/lib/db/mongodb";
import { GET } from "@/app/api/health/route";

vi.mock("@/lib/db/mongodb", () => ({ connectMongo: vi.fn() }));

const connectMock = vi.mocked(connectMongo);

describe("GET /api/health", () => {
  afterEach(() => vi.restoreAllMocks());

  it("reports database readiness without returning connection details", async () => {
    connectMock.mockResolvedValue(mongoose);
    const response = await GET();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: { status: "ok", database: "connected" },
      error: null,
    });
  });

  it("reports an unavailable database without exposing internal errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    connectMock.mockRejectedValue(new Error("credentials must not be returned"));
    const response = await GET();
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      data: null,
      error: { message: "The database is unavailable." },
    });
  });
});
