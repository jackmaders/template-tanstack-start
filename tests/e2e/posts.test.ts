import { expect } from "@playwright/test";
import { test } from "./fixtures";

const POSTS_URL = /\/posts$/;

test.describe("posts", () => {
	test("creates and deletes a post", async ({ page, signedInAccount }) => {
		await page.getByRole("link", { exact: true, name: "Posts" }).click();
		await expect(page).toHaveURL(POSTS_URL);

		const posts = page.getByRole("region", { name: "Your posts" });
		await expect(
			posts.getByRole("heading", { name: "Your posts" }),
		).toBeVisible();
		await expect(posts.getByText("0 posts", { exact: true })).toBeVisible();
		await expect(
			posts.getByText("No posts yet. Your new posts will show up here."),
		).toBeVisible();

		const title = `E2E post for ${signedInAccount.name}`;
		const titleField = page.getByLabel("Post title", { exact: true });
		const addPostButton = page.getByRole("button", {
			exact: true,
			name: "Add post",
		});

		await expect(addPostButton).toBeDisabled();
		await titleField.fill(title);
		await expect(addPostButton).toBeEnabled();
		await addPostButton.click();

		const post = posts.getByRole("listitem").filter({ hasText: title });
		await expect(post).toBeVisible();
		await expect(posts.getByText("1 post", { exact: true })).toBeVisible();
		await expect(titleField).toHaveValue("");

		await post
			.getByRole("button", { exact: true, name: `Delete ${title}` })
			.click();
		await expect(post).toHaveCount(0);
		await expect(posts.getByText("0 posts", { exact: true })).toBeVisible();
		await expect(
			posts.getByText("No posts yet. Your new posts will show up here."),
		).toBeVisible();
	});
});
