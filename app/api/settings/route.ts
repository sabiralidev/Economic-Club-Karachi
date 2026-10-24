import { apiError, serializeDocument, success } from "@/lib/api/http";
import { connectMongo } from "@/lib/db/mongodb";
import { SiteSettings } from "@/models/site-settings";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectMongo();
    const settings = await SiteSettings.findById("public")
      .select("contact socialLinks logo seoDefaults updatedAt").lean();
    return success(serializeDocument(settings));
  } catch (error) {
    return apiError(error);
  }
}
