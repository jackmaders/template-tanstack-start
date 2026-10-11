import { env } from "cloudflare:workers";
import { betterAuth } from "better-auth/minimal";
import { expect, it, vi } from "vitest";
import "@/lib/auth/auth.server";

vi.mock("better-auth/minimal");

const configuration = vi.mocked(betterAuth).mock.calls.at(-1)?.[0];

it("configures email authentication using Worker bindings and cookie support", () => {
	// Act
	const options = configuration;

	// Assert
	expect(options?.baseURL).toBe(env.BETTER_AUTH_URL);
	expect(options?.secret === env.BETTER_AUTH_SECRET).toBe(true);
	expect(options?.emailAndPassword?.enabled).toBe(true);
	expect(options?.database).toBeTypeOf("function");
	expect(options?.plugins?.at(-1)?.id).toBe("tanstack-start-cookies");
});
