import { expect, test } from "@playwright/test";

test("home page presents the club and primary routes", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /a meeting place for karachi's economic future/i })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Membership" })).toHaveAttribute("href", "/membership");

  const healthResponse = await page.request.get("/api/health");
  expect(healthResponse.ok()).toBeTruthy();
  await expect(healthResponse.json()).resolves.toEqual({ status: "ok" });
});
