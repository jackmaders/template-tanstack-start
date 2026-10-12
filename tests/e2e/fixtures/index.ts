import { test as base } from "@playwright/test";
import { createTestAccount, type TestAccount } from "../../data/account";
import { AccountActions } from "../components/account-actions";

interface TestFixtures {
	account: TestAccount;
	app: {
		goto: (url: string) => Promise<void>;
	};
	signedInAccount: TestAccount;
}

export const test = base.extend<TestFixtures>({
	account: async ({ page: _ }, use) => {
		await use(createTestAccount());
	},
	app: async ({ page }, use) => {
		await use({
			goto: async (url) => {
				await page.goto(url);
				await page.locator('body[data-hydrated="true"]').waitFor();
			},
		});
	},
	signedInAccount: async ({ account, app, page }, use) => {
		await app.goto("/");
		const accountActions = new AccountActions(page);
		await accountActions.signUp(account);
		await use(account);
		await accountActions.signOut();
	},
});
