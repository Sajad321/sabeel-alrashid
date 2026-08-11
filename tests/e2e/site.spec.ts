import { test, expect } from "@playwright/test";
test("Arabic home and English locale switch render correctly", async ({
  page,
}) => {
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("main")).toBeVisible();
  await page.getByRole("button", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en/);
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});
test("news filters are URL driven", async ({ page }) => {
  await page.goto("/en/news");
  await page.getByRole("button", { name: "Expansion" }).click();
  await expect(page).toHaveURL(/category=expansion/);
  await expect(page.locator(".newsgrid")).toBeVisible();
});
test("job query preselects a published role when one exists", async ({
  page,
}) => {
  await page.goto("/en/careers/apply");
  const select = page.locator('select[name="job"]');
  const publishedJobs = select.locator('option:not([value=""])');

  if ((await publishedJobs.count()) === 0) {
    await expect(select).toHaveValue("");
    return;
  }

  const slug = await publishedJobs.first().getAttribute("value");
  expect(slug).toBeTruthy();
  await page.goto(`/en/careers/apply?job=${encodeURIComponent(slug!)}`);
  await expect(select).toHaveValue(slug!);
});
test("branch pins link to their Google Maps coordinates", async ({ page }) => {
  await page.goto("/en");
  const firstPin = page.locator(".gpin").first();
  await expect(firstPin).toHaveAttribute("target", "_blank");
  await expect(firstPin).toHaveAttribute(
    "href",
    /google\.com\/maps\/dir\/\?api=1&destination=-?\d+(\.\d+)?,-?\d+(\.\d+)?/,
  );
});
