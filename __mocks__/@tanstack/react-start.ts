import { vi } from "vitest";

export const createServerFn = vi.fn(() => {
	let middlewares: Array<(options: unknown) => unknown> = [];
	let validator: { parse: <T>(data: T) => T };

	const next = vi.fn();

	const builder = {
		handler: vi.fn((handlerFn) => async (options?: { data?: unknown }) => {
			const context: Record<string, unknown> = {};

			for (const middleware of middlewares) {
				// biome-ignore lint/performance/noAwaitInLoops: need to run middlewares sequentially
				const result = await middleware({ ...options, context, next });
				if (next.mock.calls.length === 0) {
					return result;
				}
			}

			const data = (await validator?.parse(options?.data)) ?? options?.data;

			return await handlerFn({ ...options, context, data });
		}),
		middleware: vi.fn((middlewareFns) => {
			middlewares = middlewareFns;
			return builder;
		}),

		validator: vi.fn((validatorFn) => {
			validator = validatorFn;
			return builder;
		}),
	};

	return builder;
});

export const createMiddleware = vi.fn(() => ({
	server: vi.fn((middleware) => middleware),
}));

export const useServerFn = vi.fn((fn) => fn);
