import { expect, test } from "@playwright/test";

test("home page presents the club and primary routes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Progress begins when people come together." })).toBeVisible();
  await expect(page).toHaveTitle("Economic Club Karachi");
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Membership" })).toHaveAttribute("href", "/membership");

  const healthResponse = await page.request.get("/api/health");
  expect(healthResponse.ok()).toBeTruthy();
  await expect(healthResponse.json()).resolves.toEqual({ status: "ok" });
});

const publicRoutes = [
  "/",
  "/about",
  "/services",
  "/business",
  "/events",
  "/community",
  "/gallery",
  "/insights",
  "/membership",
  "/contact",
  "/privacy",
  "/terms",
  "/services/ideas-and-dialogue",
  "/insights/questions-for-a-changing-city",
];

for (const viewport of [
  { label: "mobile", width: 390, height: 844 },
  { label: "tablet", width: 768, height: 1024 },
  { label: "desktop", width: 1440, height: 1000 },
]) {
  test(`public routes render at ${viewport.label} width without horizontal overflow`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const route of publicRoutes) {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `${route} should load`).toBe(200);
      await expect(page.locator("main h1").first(), `${route} should have a page heading`).toBeVisible();
      const widths = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(widths.content, `${route} should not overflow at ${viewport.width}px`).toBeLessThanOrEqual(widths.viewport);
    }
  });
}

test("insight search, category filters, and show-more interaction work", async ({ page }) => {
  await page.goto("/insights");
  await expect(page.locator("article")).toHaveCount(1);
  await page.getByRole("button", { name: "Show more drafts" }).click();
  await expect(page.locator("article")).toHaveCount(2);
  await page.getByLabel("Search drafts").fill("useful dialogue");
  await expect(page.locator("article")).toHaveCount(1);
  await expect(page.locator("article")).toContainText("Making room for useful dialogue");
  await page.getByLabel("Search drafts").fill("no matching article");
  await expect(page.getByText("No matching articles")).toBeVisible();
});

test("event and gallery filters preserve their verified empty states", async ({ page }) => {
  await page.goto("/events");
  await expect(page.getByText("No upcoming events announced")).toBeVisible();
  await page.getByRole("button", { name: "past events" }).click();
  await expect(page.getByText("No past events published")).toBeVisible();
  await page.goto("/gallery");
  await expect(page.getByText("No approved ECK photos yet")).toBeVisible();
  await page.getByRole("button", { name: "Community", exact: true }).click();
  await expect(page.getByText("No approved ECK photos yet")).toBeVisible();
});

test("unknown event and gallery slugs return not found", async ({ page }) => {
  for (const route of ["/events/not-confirmed", "/gallery/not-approved", "/services/unknown-service", "/insights/unknown-article"]) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This page isn't available." })).toBeVisible();
  }
});
