const TEST_ACCOUNT_PASSWORD = "a-strong-e2e-password";

export interface TestAccount {
	email: string;
	name: string;
	password: string;
}

export function createTestAccount(): TestAccount {
	const [id] = crypto.randomUUID().split("-");

	return {
		email: `e2e-${id}@example.test`,
		name: `E2E User ${id}`,
		password: TEST_ACCOUNT_PASSWORD,
	};
}
