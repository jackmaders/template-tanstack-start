import { vi } from "vitest";

const invalidateQueries = vi.fn();
export const useQueryClient = vi.fn(() => ({ invalidateQueries }));
export const useMutation = vi.fn((options) => options);
export const useSuspenseQuery = vi.fn(() => ({ data: undefined }));
export const queryOptions = vi.fn((options) => options);
