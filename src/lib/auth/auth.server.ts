import "@tanstack/react-start/server-only";

import { env } from "cloudflare:workers";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getDb } from "@/db/db.server";
import { account, session, user, verification } from "@/db/schema/auth";

export const auth = betterAuth({
	// biome-ignore lint/style/useNamingConvention: baseURL property required by better auth
	baseURL: env.BETTER_AUTH_URL,
	database: drizzleAdapter(getDb(), {
		provider: "sqlite",
		schema: { account, session, user, verification },
	}),
	emailAndPassword: { enabled: true },
	plugins: [tanstackStartCookies()],
	secret: env.BETTER_AUTH_SECRET,
});
