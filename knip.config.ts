import type { KnipConfig } from "knip";

const config: KnipConfig = {
	entry: [
		"src/routeTree.gen.ts!",
		"src/client.tsx!",
		"src/server.ts!",
		"src/start.ts!",
		"tests/vitest/setup.ts",
	],
	ignore: [
		".agents/**",
		"src/components/ui/*",
		"src/testing/**",
		"tests/e2e/**",
		"tests/data/**",
	],
	ignoreBinaries: ["wrangler"],
	ignoreDependencies: ["cloudflare"],
	ignoreExportsUsedInFile: true,
	rules: {
		cycles: "error",
	},
	treatConfigHintsAsErrors: true,
};

export default config;
