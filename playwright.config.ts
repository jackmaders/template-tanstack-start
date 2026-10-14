import { defineConfig, devices } from "@playwright/test";

const isCi = Boolean(process.env.CI);
const usePreview = process.env.E2E_USE_PREVIEW !== "false";
const externalBaseUrl = process.env.E2E_BASE_URL?.trim();

const devBaseUrl = "http://localhost:5173";
const previewBaseUrl = "http://localhost:8787";

const baseUrl = externalBaseUrl || (usePreview ? previewBaseUrl : devBaseUrl);

export default defineConfig({
	forbidOnly: isCi,
	fullyParallel: true,
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],
	reporter: isCi ? "github" : "list",
	retries: isCi ? 2 : 0,
	testDir: "./tests/e2e",
	use: {
		baseURL: baseUrl,
		trace: "on-first-retry",
	},
	workers: isCi ? 1 : undefined,
	...getWebServerConfig(),
});

function getWebServerConfig() {
	if (externalBaseUrl) {
		return {};
	}

	const steps: string[] = [];

	if (usePreview && !isCi && process.env.E2E_SKIP_BUILD !== "true") {
		steps.push("bun run build");
	}

	steps.push("bun run db:migrate --local");

	if (usePreview) {
		steps.push("bun run cf:preview");
	} else {
		steps.push("bun run dev");
	}

	return {
		webServer: {
			command: steps.join(" && "),
			env: {
				BETTER_AUTH_SECRET:
					process.env.BETTER_AUTH_SECRET ||
					"template-local-test-only-secret-value",
			},
			timeout: 120_000,
			url: baseUrl,
		},
	};
}
