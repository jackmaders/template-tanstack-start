// biome-ignore-all lint/style/useNamingConvention: NodeJS and environment variable names follow external conventions.
// biome-ignore lint/style/noNamespace: ProcessEnv augmentation requires the NodeJS namespace.
declare namespace NodeJS {
	interface ProcessEnv {
		/** Any nonempty value enables the build bundle visualizer and opens its report. */
		ANALYSE?: string;
		/** Any nonempty value enables Playwright's CI settings, including retries and the GitHub reporter. */
		CI?: string;
		/** External URL for browser tests; when provided, Playwright skips starting a local server. */
		E2E_BASE_URL?: string;
		/** Set to "true" to reuse an existing build when running browser tests against preview. */
		E2E_SKIP_BUILD?: string;
		/** Set to "true" to run browser tests against Cloudflare preview instead of the dev server. */
		E2E_USE_PREVIEW?: string;
		/** Wrangler logging level; build and test configurations default it to "error" when unset. */
		WRANGLER_LOG?: string;
	}
}
