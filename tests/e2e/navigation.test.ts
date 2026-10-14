import { expect } from "@playwright/test";
import { test as it } from "./fixtures";

const HOME_URL = /\/$/u;

it.describe("public navigation", () => {
	it("visits the public pages and redirects guests away from posts", async ({
		app,
		page,
	}) => {
		await app.goto("/");

		await expect(page).toHaveTitle("TanStack Start Starter");
		await expect(
			page.getByRole("heading", { name: "Welcome to TanStack Start" }),
		).toBeVisible();

		await page.getByRole("link", { exact: true, name: "About" }).click();
		await expect(
			page.getByRole("heading", { name: "About this starter" }),
		).toBeVisible();

		await page.getByRole("link", { exact: true, name: "Home" }).click();
		await expect(
			page.getByRole("heading", { name: "Welcome to TanStack Start" }),
		).toBeVisible();

		await page.getByRole("link", { exact: true, name: "Posts" }).click();
		await expect(page).toHaveURL(HOME_URL);
		await expect(
			page.getByRole("heading", { name: "Welcome to TanStack Start" }),
		).toBeVisible();
	});
});
