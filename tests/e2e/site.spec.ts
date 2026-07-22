import { test, expect } from "@playwright/test";
test("Arabic home and English locale switch render correctly", async ({
  page,
}) => {
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(
    page.getByRole("heading", { name: "نمنح علامات الضيافة قوّةً للنمو." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en/);
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});
test("news filters are URL driven", async ({ page }) => {
  await page.goto("/en/news");
  await page.getByRole("button", { name: "Expansion" }).click();
  await expect(page).toHaveURL(/category=expansion/);
  await expect(
    page.getByRole("heading", { name: "Super Chicken opens its 32nd branch" }),
  ).toBeVisible();
});
test("job query preselects the application role", async ({ page }) => {
  await page.goto("/en/careers/apply?job=marketing-specialist");
  await expect(page.locator('select[name="job"]')).toHaveValue(
    "marketing-specialist",
  );
});
