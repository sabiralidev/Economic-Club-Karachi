import "server-only";
import type { AdminSession } from "@/lib/auth/session";
import { ApiError } from "@/lib/api/http";
import { getServerEnvironment } from "@/lib/env";

export type AdminRole = AdminSession["role"];

export async function requireAdminUser(request: Request, allowedRoles: AdminRole[] = ["admin", "editor"]): Promise<AdminSession> {
  const { getAdminSession } = await import("@/lib/auth/session");
  const session = await getAdminSession();
  if (!session) throw new ApiError("Authentication is required.", 401);
  if (!allowedRoles.includes(session.role)) throw new ApiError("You do not have permission to perform this action.", 403);
  if (request.method !== "GET" && request.method !== "HEAD") assertSameOrigin(request);
  return session;
}

export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  const configuredOrigin = new URL(getServerEnvironment().NEXT_PUBLIC_SITE_URL).origin;
  const localDevelopmentOrigin = process.env.NODE_ENV === "production" ? null : new URL(request.url).origin;
  if (!origin || (origin !== configuredOrigin && origin !== localDevelopmentOrigin)) {
    throw new ApiError("The request origin is not allowed.", 403);
  }
}

export function canManageRole(role: AdminRole, required: AdminRole): boolean {
  return required === "editor" || role === "admin";
}
