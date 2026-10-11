import { DEFAULT_DELAY_MS } from "@/testing/constants";

export function resolveWithDelay(value: unknown, delay = DEFAULT_DELAY_MS) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(value), delay);
	});
}
