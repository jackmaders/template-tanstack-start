import { vi } from "vitest";

const invalidateQueries = vi.fn();
export const useQueryClient = vi.fn(() => ({ invalidateQueries }));
export const useMutation = vi.fn(<TOptions>(options: TOptions) => options);
export const useSuspenseQuery = vi.fn(() => ({ data: undefined as unknown }));
export const queryOptions = vi.fn(<TOptions>(options: TOptions) => options);
