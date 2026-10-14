const reportedErrors = new WeakSet<object>();

/** Reporting is best-effort and must never prevent recovery. */
export function reportError(error: unknown, context: string) {
	if (typeof error === "object" && error !== null) {
		if (reportedErrors.has(error)) {
			return;
		}
		reportedErrors.add(error);
	}
	try {
		// biome-ignore lint/suspicious/noConsole: Replace this reporting sink when an observability provider is configured.
		console.error(`[${context}]`, error);
	} catch {
		// Reporting failure must not replace the original failure.
	}
}
