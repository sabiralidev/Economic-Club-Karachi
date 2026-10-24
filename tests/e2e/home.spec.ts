import { expect, test } from "@playwright/test";

test("home page presents the club and primary routes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Progress begins when people come together." })).toBeVisible();
  await expect(page).toHaveTitle("Economic Club Karachi");
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Membership" })).toHaveAttribute("href", "/membership");

  const healthResponse = await page.request.get("/api/health");
  const healthBody = await healthResponse.json();
  expect([200, 503]).toContain(healthResponse.status());
  expect(healthBody).toHaveProperty("data");
  expect(healthBody).toHaveProperty("error");
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

test("published insight search uses a server-backed query", async ({ page }) => {
  await page.goto("/insights");
  await page.getByLabel("Search articles").fill("local development");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/q=local\+development/);
  await expect(page.getByRole("heading", { name: /No published articles|temporarily unavailable/ })).toBeVisible();
});

test("event and gallery filters are submitted to the server", async ({ page }) => {
  await page.goto("/events");
  await page.getByLabel("Event period").selectOption("past");
  await page.getByRole("button", { name: "Filter" }).click();
  await expect(page).toHaveURL(/status=past/);
  await expect(page.getByRole("heading", { name: /No past events published|temporarily unavailable/ })).toBeVisible();
  await page.goto("/gallery");
  await page.getByLabel("Search gallery").fill("community");
  await page.getByRole("button", { name: "Filter" }).click();
  await expect(page).toHaveURL(/q=community/);
  await expect(page.getByRole("heading", { name: /No approved ECK photos|temporarily unavailable/ })).toBeVisible();
});

test("unknown event and gallery slugs return not found", async ({ page }) => {
  const healthResponse = await page.request.get("/api/health");
  test.skip(healthResponse.status() !== 200, "Dynamic not-found behavior requires a configured MongoDB connection.");
  for (const route of ["/events/not-confirmed", "/gallery/not-approved", "/services/unknown-service", "/insights/unknown-article"]) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This page isn't available." })).toBeVisible();
  }
});

test("admin pages and APIs reject unauthenticated access", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Admin sign-in" })).toBeVisible();
  const read = await page.request.get("/api/admin/services");
  expect(read.status()).toBe(401);
  await expect(read.json()).resolves.toMatchObject({
    data: null,
    error: { message: "Authentication is required." },
  });
  const mutation = await page.request.post("/api/admin/services", {
    data: { title: "Unauthorized", slug: "unauthorized", summary: "Invalid", description: "Invalid", category: "test" },
  });
  expect(mutation.status()).toBe(401);
});
