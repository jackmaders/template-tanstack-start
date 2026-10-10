import type { KnipConfig } from "knip";

const config: KnipConfig = {
	biome: { config: [".config/biome.json"] },
	commitlint: { config: [".config/commitlint.config.mjs"] },
	drizzle: { config: [".config/drizzle.config.ts"] },
	entry: [
		"src/routeTree.gen.ts!",
		"src/client.tsx!",
		"src/server.ts!",
		"src/start.ts!",
	],
	ignore: ["src/components/ui/*"],
	ignoreDependencies: ["cloudflare"],
	ignoreExportsUsedInFile: true,
	lefthook: { config: [".config/lefthook.yml"] },
	playwright: { config: [".config/playwright.config.ts"] },
	rules: {
		binaries: "error",
		cycles: "error",
		dependencies: "error",
		devDependencies: "error",
		duplicates: "error",
		enumMembers: "error",
		exports: "error",
		files: "error",
		namespaceMembers: "error",
		types: "error",
		unlisted: "error",
		unresolved: "error",
	},
	treatConfigHintsAsErrors: true,
	vite: { config: [".config/vite.config.ts"] },
	vitest: { config: [".config/vitest.config.ts"] },
	wrangler: { config: [".config/wrangler.json"] },
};

export default config;
