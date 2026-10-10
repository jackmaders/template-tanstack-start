import { vi } from "vitest";

export const mutateAsync = vi.fn();
export const useDeletePost = vi.fn(() => ({ mutateAsync }));
