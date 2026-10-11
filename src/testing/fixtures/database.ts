import { vi } from "vitest";

export function createDatabaseFixture() {
	return {
		delete: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		insert: vi.fn().mockReturnThis(),
		limit: vi.fn(),
		orderBy: vi.fn().mockReturnThis(),
		returning: vi.fn(),
		select: vi.fn().mockReturnThis(),
		values: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
	};
}
