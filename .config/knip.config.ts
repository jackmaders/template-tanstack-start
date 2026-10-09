import type { KnipConfig } from "knip";

const config: KnipConfig = {
	entry: [
		"src/routeTree.gen.ts!",
		"src/client.tsx!",
		"src/server.ts!",
		"src/start.ts!",
	],

	ignoreExportsUsedInFile: true,
	treatConfigHintsAsErrors: true,
	rules: {
		files: "error",
		dependencies: "error",
		devDependencies: "error",
		unlisted: "error",
		binaries: "error",
		unresolved: "error",
		exports: "error",
		types: "error",
		enumMembers: "error",
		namespaceMembers: "error",
		cycles: "error",
		duplicates: "error",
	},

	biome: { config: [".config/biome.json"] },
	commitlint: { config: [".config/commitlint.config.mjs"] },
	drizzle: { config: [".config/drizzle.config.ts"] },
	lefthook: { config: [".config/lefthook.yml"] },
	playwright: { config: [".config/playwright.config.ts"] },
	vite: { config: [".config/vite.config.ts"] },
	vitest: { config: [".config/vitest.config.ts"] },
	wrangler: { config: [".config/wrangler.json"] },
};

export default config;
