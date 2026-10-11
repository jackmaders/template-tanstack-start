export const DEFAULT_DELAY_MS = 1000;

export function resolveWithDelay(value: unknown, delay = DEFAULT_DELAY_MS) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(value), delay);
	});
}
