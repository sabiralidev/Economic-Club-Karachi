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
  if (!origin) {
    throw new ApiError("The request origin is not allowed.", 403);
  }

  const requestOrigin = new URL(request.url).origin;
  const configuredOrigin = new URL(getServerEnvironment().NEXT_PUBLIC_SITE_URL).origin;
  const forwardedOrigin = getForwardedOrigin(request);

  if (origin !== requestOrigin && origin !== configuredOrigin && origin !== forwardedOrigin) {
    throw new ApiError("The request origin is not allowed.", 403);
  }
}

function getForwardedOrigin(request: Request): string | null {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return null;
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol || (process.env.NODE_ENV === "production" ? "https" : "http");
  return `${protocol}://${host}`;
}

export function canManageRole(role: AdminRole, required: AdminRole): boolean {
  return required === "editor" || role === "admin";
}
