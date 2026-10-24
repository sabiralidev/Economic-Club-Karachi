import mongoose, { Types } from "mongoose";
import { afterAll, describe, expect, it } from "vitest";
import { Inquiry } from "@/models/inquiry";

const testUri = process.env.TEST_MONGODB_URI;
const testDatabaseName = databaseName(testUri);
const isIsolatedTestDatabase = testDatabaseName?.endsWith("_test") ?? false;

describe("MongoDB integration safety", () => {
  it("requires a database name ending in _test when a test URI is configured", () => {
    if (testUri) expect(isIsolatedTestDatabase).toBe(true);
  });
});

const databaseTests = describe.skipIf(!testUri || !isIsolatedTestDatabase);

databaseTests("MongoDB inquiry persistence", () => {
  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });

  it("creates, reads, and removes only its own isolated fixture", async () => {
    await mongoose.connect(testUri!, { serverSelectionTimeoutMS: 5_000 });
    const id = new Types.ObjectId();
    const email = `integration-${id.toHexString()}@example.test`;

    try {
      const created = await Inquiry.create({
        _id: id,
        name: "Integration Test",
        email,
        purpose: "general",
        message: "This database integration fixture is isolated.",
        consent: true,
      });
      const stored = await Inquiry.findById(created.id).lean();
      expect(stored?.email).toBe(email);
      expect(stored?.status).toBe("new");
    } finally {
      await Inquiry.deleteOne({ _id: id });
    }
  });
});

function databaseName(uri: string | undefined): string | undefined {
  if (!uri) return undefined;
  try {
    return decodeURIComponent(new URL(uri).pathname.split("/").filter(Boolean)[0] ?? "");
  } catch {
    return undefined;
  }
}
