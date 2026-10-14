import process from "node:process";
import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

process.env.WRANGLER_LOG ??= "error";

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		coverage: {
			exclude: [
				"src/db/schema/**",
				"**/__tests__/**",
				"**/__mocks__/**",
				"src/routes/**",
				"src/routeTree.gen.ts",
			],
			include: ["src/**/*.{ts,tsx}"],
			thresholds: { 100: true },
		},
		projects: [
			{
				test: {
					environment: "happy-dom",
					exclude: ["src/**/*.workers.spec.ts"],
					globals: true,
					include: ["src/**/__tests__/*.spec.{ts,tsx}"],
					name: "client",
					setupFiles: [
						"@testing-library/jest-dom/vitest",
						"tests/vitest/setup.ts",
					],
				},
			},
			{
				plugins: [
					cloudflareTest({
						main: "src/db/db.server.ts",
						wrangler: { configPath: "wrangler.json" },
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
