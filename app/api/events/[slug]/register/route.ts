import { registerForEvent } from "@/lib/api/submissions";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  return registerForEvent(request, slug);
}
