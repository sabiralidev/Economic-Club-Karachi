import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerEnvironment } from "@/lib/env";
import { connectMongo } from "@/lib/db/mongodb";
import { AdminUser } from "@/models/admin-user";

const SESSION_COOKIE = "eck-admin-session";
const SESSION_LIFETIME_SECONDS = 60 * 60 * 8;

export type AdminSession = {
  userId: string;
  email: string;
  role: "admin" | "editor";
};

function getSigningKey(): Uint8Array {
  const secret = getServerEnvironment().ADMIN_SESSION_SECRET;
  if (!secret) {
    const error = new Error("ADMIN_SESSION_SECRET must be configured for admin authentication.");
    error.name = "ServerConfigurationError";
    throw error;
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSession(userId: string, role: AdminSession["role"]): Promise<string> {
  return new SignJWT({ role })
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
  let userId: string;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string" || (payload.role !== "admin" && payload.role !== "editor")) return null;
    userId = payload.sub;
  } catch {
    return null;
  }
  await connectMongo();
  const user = await AdminUser.findOne({ _id: userId, status: "active" }).select("_id email role").lean();
  if (!user || (user.role !== "admin" && user.role !== "editor")) return null;
  return { userId: user._id.toString(), email: user.email, role: user.role };
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
