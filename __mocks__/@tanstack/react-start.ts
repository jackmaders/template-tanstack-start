import { vi } from "vitest";

type Validator = { parse: (data: unknown) => unknown };
type Handler = (options: { data: unknown }) => unknown;
type ServerFnBuilder = {
	validator: (schema: Validator) => ServerFnBuilder;
	handler: (
		handler: Handler,
	) => (options?: { data?: unknown }) => Promise<unknown>;
};

export const createServerFn = vi.fn(() => {
	let validator: Validator | undefined;
	const builder: ServerFnBuilder = {
		validator(schema) {
			validator = schema;
			return builder;
		},
		handler(handler) {
			return async (options = {}) => {
				const data = validator ? validator.parse(options.data) : options.data;
				return handler({ data });
			};
		},
	};
	return builder;
});

export const useServerFn = vi.fn(<T>(serverFn: T): T => serverFn);
