import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/db/mongodb";
import { Inquiry } from "@/models/inquiry";
import { inquirySchema } from "@/lib/validation/inquiry";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { data: null, error: { message: "Request body must be valid JSON." } },
      { status: 400 },
    );
  }

  const result = inquirySchema.safeParse(payload);
  if (!result.success) {
    return NextResponse.json(
      {
        data: null,
        error: {
          message: "Please check the enquiry details and try again.",
          issues: result.error.issues.map(({ path, message }) => ({ path, message })),
        },
      },
      { status: 400 },
    );
  }

  try {
    await connectMongo();
    const inquiry = await Inquiry.create(result.data);

    return NextResponse.json(
      { data: { id: inquiry.id }, error: null },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unable to persist ECK inquiry", error);
    return NextResponse.json(
      { data: null, error: { message: "Enquiries are temporarily unavailable." } },
      { status: 503 },
    );
  }
}