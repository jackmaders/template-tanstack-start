import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
	// Act
	await page.goto("/");

	// Assert
	await expect(page).toHaveTitle("TanStack Start Starter");
	await expect(
		page.getByRole("heading", { name: "Welcome to TanStack Start" }),
	).toBeVisible();
});
