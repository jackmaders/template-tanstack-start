import { vi } from "vitest";

const serverFnBuilder = {
	handler: vi.fn((serverFn) => serverFn),
	validator: vi.fn().mockReturnThis(),
};

export const createServerFn = vi.fn(() => serverFnBuilder);

export const useServerFn = vi.fn((serverFn) => serverFn);
