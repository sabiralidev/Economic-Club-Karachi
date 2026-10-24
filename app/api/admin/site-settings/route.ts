import { apiError, readJson, serializeDocument, success } from "@/lib/api/http";
import { requireAdminUser } from "@/lib/auth/authorization";
import { connectMongo } from "@/lib/db/mongodb";
import { siteSettingsSchema } from "@/lib/validation/content";
import { SiteSettings } from "@/models/site-settings";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await requireAdminUser(request, ["admin"]);
    await connectMongo();
    const settings = await SiteSettings.findById("public").lean();
    return success(serializeDocument(settings));
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdminUser(request, ["admin"]);
    const patch = siteSettingsSchema.parse(await readJson(request));
    await connectMongo();
    const settings = await SiteSettings.findByIdAndUpdate(
      "public",
      { $set: patch },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ).lean();
    return success(serializeDocument(settings));
  } catch (error) {
    return apiError(error);
  }
}
