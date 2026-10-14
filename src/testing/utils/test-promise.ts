import { act } from "@testing-library/react";
import { onTestFinished } from "vitest";

export function createTestPromise<T>(cleanupValue: T) {
	const { promise, resolve, reject } = Promise.withResolvers<T>();

	async function resolveAndFlush(value: T | PromiseLike<T>) {
		await act(async () => {
			resolve(value);
			await promise;
		});
	}

	onTestFinished(async () => {
		await act(async () => {
			resolve(cleanupValue);
			await promise.catch(() => undefined);
		});
	});

	return { promise, reject, resolve: resolveAndFlush };
}
