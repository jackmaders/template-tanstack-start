import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		clearMocks: true,
		coverage: {
			exclude: [
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
		environment: "happy-dom",
		globals: true,
		include: ["src/**/__tests__/*.spec.{ts,tsx}"],
		setupFiles: ["@testing-library/jest-dom/vitest"],
	},
});
