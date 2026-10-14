import type { Locator } from "@playwright/test";

export class PostItem {
	readonly root: Locator;
	private readonly title: string;

	constructor(root: Locator, title: string) {
		this.root = root;
		this.title = title;
	}

	get editButton() {
		return this.root.getByRole("button", {
			exact: true,
			name: `Edit ${this.title}`,
		});
	}

	get titleField() {
		return this.root.getByLabel("Post title", { exact: true });
	}

	get saveButton() {
		return this.root.getByRole("button", { exact: true, name: "Save changes" });
	}

	async edit() {
		await this.editButton.click();
	}

	async cancelEdit() {
		await this.root
			.getByRole("button", { exact: true, name: "Cancel" })
			.click();
	}

	async delete() {
		await this.root
			.getByRole("button", { exact: true, name: `Delete ${this.title}` })
			.click();
	}
}
