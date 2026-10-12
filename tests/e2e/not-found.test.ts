import { expect } from "@playwright/test";
import { test } from "./fixtures";

const HOME_URL = /\/$/;

test("returns from a missing page to home", async ({ app, page }) => {
	await app.goto("/does-not-exist");

	await expect(
		page.getByRole("heading", { name: "Page not found" }),
	).toBeVisible();
	await page.getByRole("link", { exact: true, name: "Return home" }).click();
	await expect(page).toHaveURL(HOME_URL);
	await expect(
		page.getByRole("heading", { name: "Welcome to TanStack Start" }),
	).toBeVisible();
});
