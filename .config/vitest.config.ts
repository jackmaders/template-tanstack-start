import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

process.env.WRANGLER_LOG ??= "error";

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		clearMocks: true,
		coverage: {
			exclude: [
				"src/db/schema/**",
				"**/__tests__/**",
				"**/__mocks__/**",
				"src/routes/**",
				"src/routeTree.gen.ts",
			],
			include: ["src/**/*.{ts,tsx}"],
			provider: "v8",
			reporter: ["text", "json", "html"],
			thresholds: {
				branches: 100,
				functions: 100,
				lines: 100,
				statements: 100,
			},
		},
		experimental: {
			diagnostics: {
				isolate: false,
				transform: false,
			},
		},
		projects: [
			{
				extends: true,
				test: {
					environment: "happy-dom",
					exclude: ["src/**/*.workers.spec.ts"],
					globals: true,
					include: [
						"src/**/__tests__/*.spec.{ts,tsx}",
						".config/**/__tests__/*.spec.ts",
					],
					name: "client",
					setupFiles: [
						"@testing-library/jest-dom/vitest",
						".config/vitest/setup.ts",
					],
				},
			},
			{
				extends: true,
				plugins: [
					cloudflareTest({
						main: "src/db/db.server.ts",
					}),
				],
				test: {
					include: ["src/**/__tests__/*.workers.spec.ts"],
					name: "workers",
				},
			},
		],
		restoreMocks: true,
	},
});
