import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("admin password hashing", () => {
  it("verifies a scrypt hash without accepting a different password", async () => {
    const encoded = await hashPassword("A long one-off test password 2026");
    expect(encoded).toMatch(/^scrypt\$/);
    await expect(verifyPassword("A long one-off test password 2026", encoded)).resolves.toBe(true);
    await expect(verifyPassword("incorrect password", encoded)).resolves.toBe(false);
  });

  it("rejects malformed hash strings", async () => {
    await expect(verifyPassword("password", "not-a-hash")).resolves.toBe(false);
  });
});
