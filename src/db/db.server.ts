import "@tanstack/react-start/server-only";

import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { authRelations } from "@/db/schema/auth";

export function getDb(db = env.DB) {
	return drizzle(db, { relations: authRelations });
}
