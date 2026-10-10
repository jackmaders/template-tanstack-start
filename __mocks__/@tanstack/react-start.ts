import { vi } from "vitest";

const serverFn = {
	handler: vi.fn((serverFn) => serverFn),
	validator: vi.fn().mockReturnThis(),
};

export const createServerFn = vi.fn(() => serverFn);

export const useServerFn = vi.fn((serverFn) => serverFn);
