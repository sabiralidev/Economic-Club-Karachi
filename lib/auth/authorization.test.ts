import { beforeEach, describe, expect, it, vi } from "vitest";
import { canManageRole, requireAdminUser } from "@/lib/auth/authorization";
import { getAdminSession } from "@/lib/auth/session";

vi.mock("@/lib/auth/session", () => ({ getAdminSession: vi.fn() }));

const sessionMock = vi.mocked(getAdminSession);

describe("admin authorization", () => {
  beforeEach(() => vi.resetAllMocks());

  it("rejects unauthenticated admin API requests", async () => {
    sessionMock.mockResolvedValue(null);
    await expect(requireAdminUser(new Request("http://localhost:3000/api/admin/services")))
      .rejects.toMatchObject({ status: 401 });
  });

  it("allows editors to manage content but not administrator-only resources", () => {
    expect(canManageRole("editor", "editor")).toBe(true);
    expect(canManageRole("editor", "admin")).toBe(false);
    expect(canManageRole("admin", "admin")).toBe(true);
  });

  it("blocks a session with insufficient role", async () => {
    sessionMock.mockResolvedValue({ userId: "507f1f77bcf86cd799439011", email: "editor@example.com", role: "editor" });
    await expect(requireAdminUser(
      new Request("http://localhost:3000/api/admin/inquiries"),
      ["admin"],
    )).rejects.toMatchObject({ status: 403 });
  });

  it("rejects cross-origin mutations and permits same-origin sessions", async () => {
    sessionMock.mockResolvedValue({ userId: "507f1f77bcf86cd799439011", email: "admin@example.com", role: "admin" });
    const crossOrigin = new Request("http://localhost:3000/api/admin/services", {
      method: "PATCH",
      headers: { origin: "https://attacker.example" },
    });
    await expect(requireAdminUser(crossOrigin)).rejects.toMatchObject({ status: 403 });

    const sameOrigin = new Request("http://localhost:3000/api/admin/services", {
      method: "PATCH",
      headers: { origin: "http://localhost:3000" },
    });
    await expect(requireAdminUser(sameOrigin)).resolves.toMatchObject({ role: "admin" });
  });
});
