import { vi } from "vitest";

interface Validator {
	parse: (data: unknown) => unknown;
}
type Handler = (options: { data: unknown }) => unknown;
interface ServerFnBuilder {
	handler: (
		handler: Handler,
	) => (options?: { data?: unknown }) => Promise<unknown>;
	validator: (schema: Validator) => ServerFnBuilder;
}

export const createServerFn = vi.fn(() => {
	let validator: Validator | undefined;
	const builder: ServerFnBuilder = {
		handler(handler) {
			return async (options = {}) => {
				const data = validator ? validator.parse(options.data) : options.data;
				return await handler({ data });
			};
		},
		validator(schema) {
			validator = schema;
			return builder;
		},
	};
	return builder;
});

export const useServerFn = vi.fn(<T>(serverFn: T): T => serverFn);
