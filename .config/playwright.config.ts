import { defineConfig, devices } from "@playwright/test";

const isCi = Boolean(process.env.CI);
const usePreview = process.env.E2E_USE_PREVIEW === "true";
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
	testDir: "../browser-tests",
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

	const steps = ["bun run db:migrate"];

	if (usePreview) {
		steps.push("bun run preview");
	} else {
		steps.push("bun run dev");
	}

	return {
		webServer: {
			command: steps.join(" && "),
			reuseExistingServer: false,
			url: baseUrl,
		},
	};
}
