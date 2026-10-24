import { NextResponse } from "next/server";
import { apiError, readJson, success } from "@/lib/api/http";
import { assertSameOrigin } from "@/lib/auth/authorization";
import { adminSessionCookie, createAdminSession, getAdminSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { enforceIdentifierRateLimit, enforceRateLimit } from "@/lib/api/rate-limit";
import { connectMongo } from "@/lib/db/mongodb";
import { adminLoginSchema } from "@/lib/validation/auth";
import { AdminUser } from "@/models/admin-user";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) return success(null);
    return success({ id: session.userId, email: session.email, role: session.role });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await enforceRateLimit(request, "admin-login", 5, 15 * 60);
    const credentials = adminLoginSchema.parse(await readJson(request));
    await enforceIdentifierRateLimit("admin-login-account", credentials.email, 10, 60 * 60);
    await connectMongo();
    const user = await AdminUser.findOne({ email: credentials.email }).select("+passwordHash");
    const passwordHash = user?.passwordHash ?? dummyPasswordHash();
    const passwordIsValid = await verifyPassword(credentials.password, passwordHash);
    if (!user || user.status !== "active" || !passwordIsValid) {
      const response = NextResponse.json(
        { data: null, error: { message: "Email or password is incorrect." } },
        { status: 401 },
      );
      response.headers.set("Cache-Control", "no-store");
      return response;
    }
    const token = await createAdminSession(user.id, user.role);
    user.lastLoginAt = new Date();
    await user.save();

    const response = success({ id: user.id, email: user.email, role: user.role });
    response.cookies.set(adminSessionCookie.name, token, adminSessionCookie.options);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    const response = success({ signedOut: true });
    response.cookies.set(adminSessionCookie.name, "", { ...adminSessionCookie.options, maxAge: 0 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    return apiError(error);
  }
}

function dummyPasswordHash(): string {
  return `scrypt$32768$8$1$${Buffer.alloc(16).toString("base64url")}$${Buffer.alloc(64).toString("base64url")}`;
}
