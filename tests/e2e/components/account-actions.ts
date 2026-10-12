import type { Locator, Page } from "@playwright/test";
import type { TestAccount } from "../../data/account";

export class AccountActions {
	private readonly page: Page;
	readonly signInTrigger: Locator;
	readonly signUpTrigger: Locator;
	readonly logOutButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.signInTrigger = page.getByRole("button", {
			exact: true,
			name: "Sign in",
		});
		this.signUpTrigger = page.getByRole("button", {
			exact: true,
			name: "Sign up",
		});
		this.logOutButton = page.getByRole("button", {
			exact: true,
			name: "Log out",
		});
	}

	get signUpDialog() {
		return this.page.getByRole("dialog").filter({
			has: this.page.getByRole("heading", {
				exact: true,
				name: "Sign up",
			}),
		});
	}

	get signUpNameField() {
		return this.signUpDialog.getByLabel("Name", { exact: true });
	}

	get signUpEmailField() {
		return this.signUpDialog.getByLabel("Email", { exact: true });
	}

	get signUpPasswordField() {
		return this.signUpDialog.getByLabel("Password", { exact: true });
	}

	get signUpSubmitButton() {
		return this.signUpDialog.getByRole("button", {
			exact: true,
			name: "Sign up",
		});
	}

	get signUpEmailError() {
		return this.signUpDialog.getByText("Enter a valid email address", {
			exact: true,
		});
	}

	get signUpPasswordLengthError() {
		return this.signUpDialog.getByText("Use at least 8 characters", {
			exact: true,
		});
	}

	get signInDialog() {
		return this.page.getByRole("dialog").filter({
			has: this.page.getByRole("heading", {
				exact: true,
				name: "Sign in",
			}),
		});
	}

	get signInEmailField() {
		return this.signInDialog.getByLabel("Email", { exact: true });
	}

	get signInPasswordField() {
		return this.signInDialog.getByLabel("Password", { exact: true });
	}

	get signInSubmitButton() {
		return this.signInDialog.getByRole("button", {
			exact: true,
			name: "Sign In",
		});
	}

	async openSignUp() {
		await this.signUpTrigger.click();
		await this.signUpDialog
			.getByRole("heading", { exact: true, name: "Sign up" })
			.waitFor({ state: "visible" });
	}

	async signUp(account: TestAccount) {
		await this.openSignUp();
		await this.signUpNameField.fill(account.name);
		await this.signUpEmailField.fill(account.email);
		await this.signUpPasswordField.fill(account.password);
		await this.signUpSubmitButton.click();

		await this.logOutButton.waitFor({ state: "visible" });
	}

	async openSignIn() {
		await this.signInTrigger.click();
		await this.signInDialog
			.getByRole("heading", { exact: true, name: "Sign in" })
			.waitFor({ state: "visible" });
	}

	async signIn(account: TestAccount) {
		await this.openSignIn();
		await this.signInEmailField.fill(account.email);
		await this.signInPasswordField.fill(account.password);
		await this.signInSubmitButton.click();

		await this.logOutButton.waitFor({ state: "visible" });
	}

	async signOut() {
		await this.logOutButton.click();
		await this.signUpTrigger.waitFor({ state: "visible" });
	}
}
