import { test as base } from "@playwright/test";
import { createTestAccount, type TestAccount } from "../../data/account";
import { AccountActions } from "../components/account-actions";

interface TestFixtures {
	account: TestAccount;
	app: {
		goto: (url: string) => Promise<void>;
	};
	browserDiagnostics: undefined;
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
	browserDiagnostics: [
		async ({ page }, use, testInfo) => {
			const problems: string[] = [];

			page.on("console", (message) => {
				if (!["warning", "error"].includes(message.type())) {
					return;
				}

				problems.push(`[console.${message.type()}] ${message.text()}`);
			});

			page.on("pageerror", (error) => {
				problems.push(`[pageerror] ${error.message}`);
			});

			await use(undefined);

			if (problems.length > 0) {
				const report = problems.join("\n");
				await testInfo.attach("browser-diagnostics", {
					body: report,
					contentType: "text/plain",
				});

				throw new Error(`Browser warnings or errors detected:\n${report}`);
			}
		},
		{ auto: true },
	],
	signedInAccount: async ({ account, app, page }, use) => {
		await app.goto("/");
		const accountActions = new AccountActions(page);
		await accountActions.signUp(account);
		await use(account);
		await accountActions.signOut();
	},
});
