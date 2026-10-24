import { expect, test } from "@playwright/test";

test("homepage content and editorial images render without horizontal overflow", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Progress begins when people come together.");
  await expect(page.getByRole("heading", { name: "A community-minded perspective on a changing city." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Published work and services." })).toBeVisible();
  await page.screenshot({ path: "test-results/home-desktop.png" });

  const images = page.locator("main img");
  const imageCount = await images.count();
  expect(imageCount).toBeGreaterThan(0);

  for (let index = 0; index < imageCount; index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element) => {
      const imageElement = element as HTMLImageElement;
      return imageElement.complete && imageElement.naturalWidth > 0;
    })).toBe(true);
  }

  const desktopWidths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(desktopWidths.content).toBeLessThanOrEqual(desktopWidths.viewport);
  expect(pageErrors).toEqual([]);
});

test("mobile navigation opens and page stays within the viewport", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const menuButton = page.getByRole("button", { name: "Menu" });
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "About" })).toBeVisible();
  await page.screenshot({ path: "test-results/home-mobile.png" });

  const mobileWidths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(mobileWidths.content).toBeLessThanOrEqual(mobileWidths.viewport);
  expect(pageErrors).toEqual([]);
});

test("inquiry form submits and reports a successful response", async ({ page }) => {
  await page.route("**/api/inquiries", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ data: { id: "test-inquiry" }, error: null }),
    });
  });

  await page.goto("/contact");
  await page.getByLabel("Name", { exact: true }).fill("Test Visitor");
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.com");
  await page.getByLabel("Message", { exact: true }).fill("I would like to learn more about ECK.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send enquiry" }).click();

  await expect(page.getByRole("status")).toHaveText("Thank you. Your enquiry has been received.");
});