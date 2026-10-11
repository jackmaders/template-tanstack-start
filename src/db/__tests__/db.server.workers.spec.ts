import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { expect, it, vi } from "vitest";
import { getDb } from "@/db/db.server";
import { authRelations } from "@/db/schema/auth";

vi.mock("drizzle-orm/d1");

it("creates a database using the default Worker binding and auth relations", () => {
	// Arrange
	const database = {} as ReturnType<typeof drizzle>;
	vi.mocked(drizzle).mockReturnValue(database);

	// Act
	const result = getDb();

	// Assert
	expect(drizzle).toHaveBeenCalledExactlyOnceWith(env.DB, {
		relations: authRelations,
	});
	expect(result).toBe(database);
});

it("creates a database using an explicitly supplied binding and auth relations", () => {
	// Arrange
	const binding = {} as typeof env.DB;
	const database = {} as ReturnType<typeof drizzle>;
	vi.mocked(drizzle).mockReturnValue(database);

	// Act
	const result = getDb(binding);

	// Assert
	expect(drizzle).toHaveBeenCalledExactlyOnceWith(binding, {
		relations: authRelations,
	});
	expect(result).toBe(database);
});
