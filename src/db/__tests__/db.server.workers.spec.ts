import { env } from "cloudflare:workers";
import { sql } from "drizzle-orm";
import { expect, it } from "vitest";
import { getDb } from "../db.server";

it("queries D1 using the default environment binding", async () => {
	const result = await getDb().get<{ value: number }>(sql`select 42 as value`);
	expect(result).toEqual({ value: 42 });
});

it("queries D1 using an explicitly supplied binding", async () => {
	const result = await getDb(env.DB).get<{ value: number }>(
		sql`select 7 as value`,
	);
	expect(result).toEqual({ value: 7 });
});
