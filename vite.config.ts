import process from "node:process";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { rolldownOptions } from "./rolldown.config.ts";

process.env.WRANGLER_LOG ??= "error";

const config = defineConfig({
	build: { rolldownOptions },
	environments: {
		ssr: { build: { chunkSizeWarningLimit: 1500 } },
	},
	plugins: [
		cloudflare({
			viteEnvironment: { name: "ssr" },
		}),
		tanstackStart(),
		devtools({ injectSource: { enabled: false } }),
		tailwindcss(),
		viteReact(),
		...(process.env.ANALYSE ? [visualizer({ open: true })] : []),
	],
	resolve: { tsconfigPaths: true },
});

export default config;
