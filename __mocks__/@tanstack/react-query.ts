import { vi } from "vitest";

const invalidateQueries = vi.fn();
export const useQueryClient = vi.fn(() => ({ invalidateQueries }));
export const useMutation = vi.fn((options) => ({
	...options,
	mutateAsync: vi.fn(async (variables) => {
		try {
			const data = await options.mutationFn(variables);
			await options.onSuccess?.(data, variables);
			return data;
		} catch (error) {
			await options.onError?.(error, variables);
			throw error;
		}
	}),
}));
export const useSuspenseQuery = vi.fn(() => ({ data: undefined }));
export const queryOptions = vi.fn((options) => options);
