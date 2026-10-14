import { defineConfig, devices } from "@playwright/test";

const isCi = Boolean(process.env.CI);
const usePreview = process.env.E2E_USE_PREVIEW === "true";
const skipBuild = process.env.E2E_SKIP_BUILD === "true" || !usePreview;
const externalBaseUrl = process.env.E2E_BASE_URL?.trim();

const devBaseUrl = "http://localhost:5173";
const previewBaseUrl = "http://localhost:8787";

const baseUrl = externalBaseUrl || (usePreview ? previewBaseUrl : devBaseUrl);

process.env.WRANGLER_LOG ??= "error";

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
	...(isCi || !usePreview ? { workers: 1 } : {}),
	...getWebServerConfig(),
});

function getWebServerConfig() {
	if (externalBaseUrl) {
		return {};
	}

	const steps = ["bun run db:migrate --local"];

	if (!skipBuild) {
		steps.push("bun run build");
	}

	steps.push(usePreview ? "bun run cf:preview" : "bun run dev");

	return {
		webServer: {
			command: steps.join(" && "),
			env: {
				BETTER_AUTH_SECRET: "template-local-test-only-secret-value",
				BETTER_AUTH_URL: baseUrl,
			},
			timeout: 120_000,
			url: baseUrl,
		},
	};
}
