import { env } from "cloudflare:workers";
import { sql } from "drizzle-orm";
import { expect, it } from "vitest";
import { getDb } from "@/db/db.server";

it("queries D1 using the default environment binding", async () => {
	// Act
	const result = await getDb().get<{ value: number }>(sql`select 42 as value`);

	// Assert
	expect(result).toEqual({ value: 42 });
});

it("queries D1 using an explicitly supplied binding", async () => {
	// Act
	const result = await getDb(env.DB).get<{ value: number }>(
		sql`select 7 as value`,
	);

	// Assert
	expect(result).toEqual({ value: 7 });
});
