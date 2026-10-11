import { vi } from "vitest";

export const mutateAsync = vi.fn();
export const mutate = vi.fn();
export const useDeletePost = vi.fn(() => ({
	isPending: false,
	mutate,
	mutateAsync,
}));
