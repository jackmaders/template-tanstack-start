import { expect } from "@playwright/test";
import { AccountActions } from "./components/account-actions";
import { test as it } from "./fixtures";

it.describe("account flows", () => {
	it("signs up, signs out, and signs back in", async ({
		app,
		page,
		account,
	}) => {
		await app.goto("/");
		const accountActions = new AccountActions(page);

		await accountActions.signUp(account);
		await expect(accountActions.logOutButton).toBeVisible();

		await accountActions.signOut();
		await expect(accountActions.signUpTrigger).toBeVisible();
		await expect(accountActions.signInTrigger).toBeVisible();

		await accountActions.signIn(account);
		await expect(accountActions.logOutButton).toBeVisible();

		await accountActions.signOut();
		await expect(accountActions.signUpTrigger).toBeVisible();
	});

	it("validates email and password during sign up", async ({ app, page }) => {
		await app.goto("/");
		const accountActions = new AccountActions(page);
		await accountActions.openSignUp();
		await accountActions.signUpNameField.fill("E2E User");

		await accountActions.signUpEmailField.fill("not-an-email");
		await accountActions.signUpEmailField.blur();
		await expect(accountActions.signUpEmailError).toBeVisible();

		await accountActions.signUpPasswordField.fill("short");
		await accountActions.signUpPasswordField.blur();
		await expect(accountActions.signUpPasswordLengthError).toBeVisible();
		await expect(accountActions.signUpSubmitButton).toBeDisabled();
	});
});
