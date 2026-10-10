import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
	environments: {
		ssr: { build: { chunkSizeWarningLimit: 1500 } },
	},
	plugins: [
		cloudflare({
			configPath: ".config/wrangler.json",
			viteEnvironment: { name: "ssr" },
		}),
		tanstackStart(),
		devtools({ injectSource: { enabled: false } }),
		tailwindcss(),
		viteReact(),
	],
	resolve: { tsconfigPaths: true },
});

export default config;
