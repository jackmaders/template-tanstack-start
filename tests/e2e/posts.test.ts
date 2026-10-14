import { expect } from "@playwright/test";
import { test } from "./fixtures";

const POSTS_URL = /\/posts$/;

test.describe("posts", () => {
	test("creates, edits, and deletes a post", async ({
		page,
		signedInAccount,
	}) => {
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

		const editButton = post.getByRole("button", {
			exact: true,
			name: `Edit ${title}`,
		});
		await expect(editButton).toHaveAttribute("aria-expanded", "false");
		await editButton.click();
		await expect(editButton).toHaveAttribute("aria-expanded", "true");
		const editTitle = post.getByLabel("Post title", { exact: true });
		await expect(editTitle).toHaveValue(title);
		await editTitle.fill("Discard this draft");
		await post.getByRole("button", { exact: true, name: "Cancel" }).click();
		await expect(editButton).toHaveAttribute("aria-expanded", "false");
		await editButton.click();
		await expect(editTitle).toHaveValue(title);
		await editTitle.fill("   ");
		const saveButton = post.getByRole("button", {
			exact: true,
			name: "Save changes",
		});
		await expect(saveButton).toBeDisabled();
		const updatedTitle = `${title} updated`;
		await editTitle.fill(updatedTitle);
		await saveButton.click();
		const updatedPost = posts
			.getByRole("listitem")
			.filter({ hasText: updatedTitle });
		await expect(
			updatedPost.getByRole("button", {
				exact: true,
				name: `Edit ${updatedTitle}`,
			}),
		).toHaveAttribute("aria-expanded", "false");
		await page.reload();
		await expect(updatedPost).toBeVisible();
		await expect(posts.getByText("1 post", { exact: true })).toBeVisible();

		await updatedPost
			.getByRole("button", { exact: true, name: `Delete ${updatedTitle}` })
			.click();
		await expect(updatedPost).toHaveCount(0);
		await expect(posts.getByText("0 posts", { exact: true })).toBeVisible();
		await expect(
			posts.getByText("No posts yet. Your new posts will show up here."),
		).toBeVisible();
	});
});
