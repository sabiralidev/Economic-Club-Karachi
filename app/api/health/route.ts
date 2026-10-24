import { NextResponse } from "next/server";
import { success } from "@/lib/api/http";
import { connectMongo } from "@/lib/db/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectMongo();
    return success({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("ECK database health check failed", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json(
      { data: null, error: { message: "The database is unavailable." } },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
