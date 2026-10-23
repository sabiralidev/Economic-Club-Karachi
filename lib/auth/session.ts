import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerEnvironment } from "@/lib/env";

const SESSION_COOKIE = "eck-admin-session";
const SESSION_LIFETIME_SECONDS = 60 * 60 * 8;

export type AdminSession = {
  userId: string;
  role: "admin";
};

function getSigningKey(): Uint8Array {
  const secret = getServerEnvironment().ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET must be configured for admin authentication.");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSession(userId: string): Promise<string> {
  return new SignJWT({ role: "admin" satisfies AdminSession["role"] })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_LIFETIME_SECONDS}s`)
    .sign(getSigningKey());
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const key = getSigningKey();
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string" || payload.role !== "admin") return null;
    return { userId: payload.sub, role: "admin" };
  } catch {
    return null;
  }
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export const adminSessionCookie = {
  name: SESSION_COOKIE,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_LIFETIME_SECONDS,
  },
};
