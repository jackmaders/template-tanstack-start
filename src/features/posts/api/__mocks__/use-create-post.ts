import { vi } from "vitest";

export const mutateAsync = vi.fn();
export const useCreatePost = vi.fn(() => ({ mutateAsync }));
