import type { Page } from "@playwright/test";
import { PostItem } from "../components/post-item";

export class PostsPage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	get posts() {
		return this.page.getByRole("region", { name: "Your posts" });
	}

	get heading() {
		return this.posts.getByRole("heading", { name: "Your posts" });
	}

	get emptyMessage() {
		return this.posts.getByText(
			"No posts yet. Your new posts will show up here.",
		);
	}

	get titleField() {
		return this.page.getByLabel("Post title", { exact: true });
	}

	get addPostButton() {
		return this.page.getByRole("button", { exact: true, name: "Add post" });
	}

	postCount(count: number) {
		return this.posts.getByText(`${count} ${count === 1 ? "post" : "posts"}`, {
			exact: true,
		});
	}

	post(title: string) {
		return new PostItem(
			this.posts.getByRole("listitem").filter({ hasText: title }),
			title,
		);
	}

	async open() {
		await this.page.getByRole("link", { exact: true, name: "Posts" }).click();
	}
}
