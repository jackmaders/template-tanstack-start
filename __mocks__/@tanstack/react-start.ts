import { vi } from "vitest";

export const createServerFn = vi.fn(() => {
	let middlewares: Array<(options: unknown) => unknown> = [];
	let validator: { parse: <T>(data: T) => T };

	const builder = {
		handler: vi.fn((handlerFn) => async (options?: { data?: unknown }) => {
			const context: Record<string, unknown> = {};
			const data = (await validator?.parse(options?.data)) ?? options?.data;

			const runHandler = async (index: number): Promise<unknown> => {
				const middleware = middlewares[index];
				if (!middleware) {
					return await handlerFn({ ...options, context, data });
				}

				return await middleware({
					...options,
					context,
					next: vi.fn(({ context: nextContext } = {}) => {
						Object.assign(context, nextContext);
						return runHandler(index + 1);
					}),
				});
			};

			return runHandler(0);
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
