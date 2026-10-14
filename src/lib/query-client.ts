import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { dispatchError, type ErrorHandler } from "./dispatch-error";

interface ErrorMeta extends Record<string, unknown> {
	handleError?: ErrorHandler;
}

declare module "@tanstack/react-query" {
	interface Register {
		mutationMeta: ErrorMeta;
		queryMeta: ErrorMeta;
	}
}

export function createQueryClient() {
	return new QueryClient({
		mutationCache: new MutationCache({
			onError: (error, _variables, _context, mutation) =>
				dispatchError(error, mutation.meta?.handleError),
		}),
		queryCache: new QueryCache({
			onError: (error, query) => dispatchError(error, query.meta?.handleError),
		}),
	});
}

/** Keep local callbacks out of Query's serialized metadata during SSR hydration. */
export function errorMeta(handleError?: ErrorHandler): ErrorMeta {
	const meta: ErrorMeta = {};
	Object.defineProperty(meta, "handleError", {
		configurable: true,
		value: handleError,
		writable: true,
	});
	return meta;
}
