import { expect } from "@playwright/test";
import { test as it } from "./fixtures";
import { PostsPage } from "./pages/posts-page";

const POSTS_URL = /\/posts$/u;

it.describe("posts", () => {
	it("creates, edits, and deletes a post", async ({
		page,
		signedInAccount,
	}) => {
		const postsPage = new PostsPage(page);
		await postsPage.open();
		await expect(page).toHaveURL(POSTS_URL);
		await expect(postsPage.heading).toBeVisible();
		await expectEmptyPosts(postsPage);

		const title = `E2E post for ${signedInAccount.name}`;
		await createPost(postsPage, title);
		await cancelPostEdit(postsPage, title);
		const updatedTitle = `${title} updated`;
		await updatePost(postsPage, { title, updatedTitle });
		await page.reload();
		await expect(postsPage.post(updatedTitle).root).toBeVisible();
		await expect(postsPage.postCount(1)).toBeVisible();
		await deletePost(postsPage, updatedTitle);
	});
});

async function expectEmptyPosts(postsPage: PostsPage) {
	await expect(postsPage.postCount(0)).toBeVisible();
	await expect(postsPage.emptyMessage).toBeVisible();
}

async function createPost(postsPage: PostsPage, title: string) {
	await expect(postsPage.addPostButton).toBeDisabled();
	await postsPage.titleField.fill(title);
	await expect(postsPage.addPostButton).toBeEnabled();
	await postsPage.addPostButton.click();
	await expect(postsPage.post(title).root).toBeVisible();
	await expect(postsPage.postCount(1)).toBeVisible();
	await expect(postsPage.titleField).toHaveValue("");
}

async function cancelPostEdit(postsPage: PostsPage, title: string) {
	const post = postsPage.post(title);
	await expect(post.editButton).toHaveAttribute("aria-expanded", "false");
	await post.edit();
	await expect(post.editButton).toHaveAttribute("aria-expanded", "true");
	await expect(post.titleField).toHaveValue(title);
	await post.titleField.fill("Discard this draft");
	await post.cancelEdit();
	await expect(post.editButton).toHaveAttribute("aria-expanded", "false");
	await post.edit();
	await expect(post.titleField).toHaveValue(title);
}

async function updatePost(
	postsPage: PostsPage,
	{ title, updatedTitle }: { title: string; updatedTitle: string },
) {
	const post = postsPage.post(title);
	await post.titleField.fill("   ");
	await expect(post.saveButton).toBeDisabled();
	await post.titleField.fill(updatedTitle);
	await post.saveButton.click();
	await expect(postsPage.post(updatedTitle).editButton).toHaveAttribute(
		"aria-expanded",
		"false",
	);
}

async function deletePost(postsPage: PostsPage, title: string) {
	const post = postsPage.post(title);
	await post.delete();
	await expect(post.root).toHaveCount(0);
	await expectEmptyPosts(postsPage);
}
