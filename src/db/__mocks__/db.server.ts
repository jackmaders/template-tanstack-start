import { vi } from "vitest";

export const db = {
	delete: vi.fn().mockReturnThis(),
	from: vi.fn().mockReturnThis(),
	insert: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	orderBy: vi.fn().mockReturnThis(),
	returning: vi.fn().mockReturnThis(),
	select: vi.fn().mockReturnThis(),
	values: vi.fn().mockReturnThis(),
	where: vi.fn().mockReturnThis(),
};

export const getDb = vi.fn(() => db);
